import db from "../../../../config/db.js";
import insertAssignment from "../../../../models/accreditation/assignments/POST/insertAssignment.js";
import updateAssignment from "../../../../models/accreditation/assignments/UPDATE/updateAssignment.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const addAssignment = async (req, res) => {
  const {
    userIDList,
    accredInfoId,
    levelId,
    programId,
    areaId,
    parameterId = null,
    subParameterId = null,
    indicatorId = null
  } = req.body;

  if (!accredInfoId || !levelId || !programId || !areaId) {
    return res.status(400).json({
      message: 'IDs of accreditation, level, program, and area are required.',
      success: false
    });
  }

  const userIDs = Array.isArray(userIDList) ? userIDList : [userIDList];

  if (!userIDs.length || userIDs.some(id => !id)) {
    return res.status(400).json({
      success: false,
      message: 'User IDs must be valid and not empty.'
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const commonData = { accredInfoId, levelId, programId, areaId, parameterId, subParameterId, indicatorId };

    const results = [];

    for (const userId of userIDs) {
      // Check if record exists
      const [existing] = await connection.execute(
        `SELECT id FROM accreditation_assignment 
         WHERE user_id = ? AND accred_info_id = ? AND level_id = ? AND program_id = ? AND area_id = ?`,
        [userId, accredInfoId, levelId, programId, areaId]
      );

      if (existing.length > 0) {
        // Update if parameter/sub-parameter/indicator is provided
        if (parameterId !== null || subParameterId !== null || indicatorId !== null) {
          await updateAssignment({
            taskForceId: userId,
            ...commonData
          }, connection);
          results.push({ type: 'update', userId });

        } else {
          results.push({ type: 'skip', userId });
        }

      } else {
        // Insert new record
        const insertRes = await insertAssignment({
          userId, ...commonData
        }, connection);
        results.push({ 
          type: 'insert', 
          userId, 
          insertId: insertRes.insertId 
        });
      }
    }

    await connection.commit();

    sendUpdate('assignment-update');

    res.status(200).json({
      message: 'Assignments processed successfully!',
      success: true,
      results
    });

  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }

    console.error('Error processing assignments:', error);

    if (error.message === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        message: 'Duplicate entry.',
        success: false,
        isDuplicate: true,
        error
      });
    }

    res.status(500).json({
      message: 'An unexpected error occurred.',
      success: false
    });

  } finally {
    if (connection) connection.release();
  }
};

export default addAssignment;
