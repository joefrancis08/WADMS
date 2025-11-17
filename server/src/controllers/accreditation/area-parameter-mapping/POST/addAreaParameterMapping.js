import insertAreaParameterMapping from "../../../../models/accreditation/area-parameter-mapping/POST/insertAreaParameterMapping.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";
import db from '../../../../config/db.js';

const addAreaParameterMapping = async (req, res) => {
  const { title, year, accredBody, level, program, area, parameterNames } = req.body;
  
  try {
    // Validate title, accredBody, level, program, and area
    if (
        !title?.trim() || !accredBody?.trim() || 
        !level?.trim() || !program?.trim() ||
        !area?.trim()
      ) {
      return res.status(400).json({
        success: false,
        message: 'Title, Accreditation Body, Level, Program, and Area are required and must not be empty.'
      });
    }

    // Validate year
    if (!/^\d{4}$/.test(year)) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid 4-digit number.'
      });
    }

    /* 
      Ensure parameterNames are always treated as an array
      If it's already an array, use it as is
      If it's a single string, wrap it inside an array
    */
    const parameters = (Array.isArray(parameterNames) ? parameterNames : [parameterNames])
      .map(a => a.trim())
      .filter(a => a.length > 0);

    // Validate if parameters array is not empty
    if (parameters.length === 0 || !parameterNames) {
      return res.status(400).json({
        success: false,
        message: 'Parameter names must not be empty.'
      });
    }

    // Store the results of each insertion
    const results = [];
    for (const parameterName of parameters) {
      // Insert each parameter into the database with its associated period, level, program, and area
      const response = await insertAreaParameterMapping({
        title,
        year,
        accredBody,
        level,
        program,
        area,
        parameter: parameterName
      });
      results.push(response); // Collect the response for reporting back to client

      // --- Auto-assign newly created parameter to Task-Force Chair(s) of the area ---
      // Try to extract IDs from response (model should return these when possible)
      const parameterId = response?.parameterID ?? response?.insertId ?? null;
      const areaId = response?.areaID ?? response?.area_id ?? null;
      const accredInfoId = response?.accredInfoId ?? response?.accred_info_id ?? null;
      const levelId = response?.levelId ?? response?.level_id ?? null;
      const programId = response?.programId ?? response?.program_id ?? null;

      if (parameterId && areaId) {
        try {
          const areaCol = await resolveUserAreaColumn(db);
          let chairs;
          if (areaCol) {
            [chairs] = await db.execute(
              `SELECT user_id FROM users WHERE role = ? AND ${areaCol} = ?`,
              ['TASK_FORCE_CHAIR', areaId]
            );
          } else {
            // fallback: find chairs via existing accreditation_assignment rows
            [chairs] = await db.execute(
              `SELECT DISTINCT u.user_id
                 FROM users u
                 JOIN accreditation_assignment aa ON aa.user_id = u.user_id
                WHERE u.role = ? AND aa.area_id = ?`,
              ['TASK_FORCE_CHAIR', areaId]
            );
          }

          if (chairs && chairs.length > 0) {
            const insertValues = chairs.map((c) => [
              c.user_id,
              accredInfoId ?? null,
              levelId ?? null,
              programId ?? null,
              areaId,
              parameterId,
              null,
              null,
            ]);
            if (insertValues.length > 0) {
              // INSERT IGNORE to avoid duplicate constraint violation if already assigned
              await db.query(
                `INSERT IGNORE INTO accreditation_assignment
                  (user_id, accred_info_id, level_id, program_id, area_id, parameter_id, subparameter_id, indicator_id)
                 VALUES ?`,
                [insertValues]
              );
            }
          }
        } catch (innerErr) {
          // log but don't fail the whole request
          console.error('Auto-assign chair failed:', innerErr);
        }
      }
    }

    // Signal that assignments may have changed
    sendUpdate('assignment-update');
    
    // Notify frontend via WebSocket
    sendUpdate('area-parameter-update');

    // Send success response back to the client with all inserted results
    res.status(200).json({
      success: true,
      message: 'Parameters added successfully.',
      results
    });

  } catch (error) {
    console.error('addAreaParameterMapping error:', error);
    // MySQL duplicate entry -> respond 409 + include duplicateValue (if parsable)
    if (error?.code === 'ER_DUP_ENTRY' || error?.errno === 1062) {
      // try to extract duplicate value from sqlMessage: "Duplicate entry 'VALUE' for key '...'"
      const msg = error?.sqlMessage ?? error?.message ?? '';
      const m = msg.match(/Duplicate entry '(.+?)'/);
      const duplicateValue = m ? m[1] : null;
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        duplicateValue,
        message: duplicateValue ? `${duplicateValue} already exist.` : 'Duplicate entry.'
      });
    }

    // Other errors -> 500
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: (error && error.message) ? error.message : error,
    });
   }
};

// --- helper: resolve users table column that stores user's area (if any) ---
const resolveUserAreaColumn = async (db) => {
  const candidates = ['area_id','areaID','areaId','assigned_area_id','assignedAreaId','assignedArea','area'];
  const placeholders = candidates.map(() => '?').join(',');
  const [cols] = await db.execute(
    `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME IN (${placeholders})`,
    candidates
  );
  return cols && cols.length ? cols[0].COLUMN_NAME : null;
};

export default addAreaParameterMapping;