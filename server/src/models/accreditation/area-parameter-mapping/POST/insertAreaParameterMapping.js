import db from "../../../../config/db.js";
import getAreaBy from "../../areas/GET/getAreaBy.js";
import insertAssignment from "../../assignments/POST/insertAssignment.js";
import updateAssignment from "../../assignments/UPDATE/updateAssignment.js";
import getParameterBy from "../../parameters/GET/getParameterBy.js";
import insertParameter from "../../parameters/POST/insertParameter.js";

const insertAreaParameterMapping = async ({ 
  title, 
  year, 
  accredBody, 
  level, 
  program, 
  area,
  parameter
}) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const areaResult = await getAreaBy('area_name', area, connection);
    const parameterResult = await getParameterBy('parameter_name', parameter, connection);

    // Step 1: Check if a parameter exist, if not, insert it.
    let parameterId;
    if (parameterResult.length > 0) {
      parameterId = parameterResult[0].id;
      console.log('insertAPM line 27:', parameterResult);

    } else {
      if (!areaResult.length) {
        throw new Error('AREA_NOT_FOUND');
      }

      const areaID = areaResult[0].id;
      const newParameter = await insertParameter(parameter, areaID, connection);
      parameterId = newParameter.insertId;
    }

    // Step 2: Get the program_area_mapping id
    const programAreaMappingQuery = `
      SELECT pam.id
      FROM program_area_mapping pam
      JOIN info_level_program_mapping ilpm
        ON pam.info_level_program_mapping_id = ilpm.id
      JOIN accreditation_info ai
        ON ilpm.accreditation_info_id = ai.id
      JOIN accreditation_body ab
        ON ai.accreditation_body_id = ab.id
      JOIN accreditation_level al
        ON ilpm.level_id = al.id
      JOIN program p
        ON ilpm.program_id = p.id
      JOIN area a
        ON pam.area_id = a.id
      WHERE ai.title = ?
        AND ai.year = ?
        AND ab.name = ?
        AND al.level_name = ?
        AND p.program_name = ?
        AND a.area_name = ?
    `;

    const [rows] = await connection.execute(programAreaMappingQuery, [
      title, 
      year, 
      accredBody, 
      level, 
      program, 
      area
    ]);

    if (rows.length === 0) {
      throw new Error('PROGRAM_AREA_MAPPING_NOT_FOUND');
    }

    const programAreaMappingId = rows[0].id;

    // Step 3: Insert mapping
    const query = `
      INSERT INTO area_parameter_mapping (program_area_mapping_id, parameter_id) VALUES (?, ?)
    `;

    await connection.execute(query, [programAreaMappingId, parameterId]);

    /* ------------------FOR ASSIGNMENT------------------- */
    /* Reminder: Code below is temporary, it needs optimization for better query performance */
    // Start
    /* 
      The logic of the code here is if the area ID
      exist in the assignment, it should get the assign Task Force Chair
      then auto assign him/her also to the parameter so that later
      he/she can assign Task Force Member to each parameter.
    */
    const assignmentQuery = `
      SELECT
        aa.id                        AS assignmentID,
        u.id                         AS taskForceID,
        u.user_uuid                  AS taskForceUUID,
        u.full_name                  AS taskForce,
        u.role                       AS role,
        ai.id                        AS accredID,
        ai.uuid                      AS accredUUID,
        ai.title                     AS accredTitle,
        ai.year                      AS accredYear,
        ab.name                      AS accredBody,
        al.id                        AS levelID,
        al.level_name                AS level,
        pr.id                        AS programID,
        pr.uuid                      AS programUUID,
        pr.program_name              AS program,
        a.id                         AS areaID,
        a.uuid                       AS areaUUID,
        a.area_name                  AS area,
        pa.id                        AS parameterID,
        pa.uuid                      AS parameterUUID,
        pa.parameter_name            AS parameter,
        spa.id                       AS subParameterID,
        spa.uuid                     AS subParameterUUID,
        spa.sub_parameter_name       AS subParameter,
        i.id                         AS indicatorID,
        i.uuid                       AS indicatorUUID,
        i.indicator_name             AS indicator
      FROM accreditation_assignment aa
      JOIN user u
        ON aa.user_id = u.id
      JOIN accreditation_info ai
        ON aa.accred_info_id = ai.id
      JOIN accreditation_body ab
        ON ai.accreditation_body_id = ab.id
      JOIN accreditation_level al
        ON aa.level_id = al.id
      JOIN program pr 
        ON aa.program_id = pr.id
      JOIN area a
        ON aa.area_id = a.id
      LEFT JOIN parameter pa
        ON aa.parameter_id = pa.id
      LEFT JOIN sub_parameter spa
        ON aa.subparameter_id = spa.id
      LEFT JOIN indicator i
        ON aa.indicator_id = i.id
      WHERE ai.title = ?
        AND ai.year = ?
        AND ab.name = ?
        AND al.level_name = ?
        AND pr.program_name = ?
        AND aa.area_id = ?
    `;

    try {
      const [assignmentRows] = await connection.execute(assignmentQuery, [
        title, year, accredBody, level, program, areaResult[0].id
      ]);

      console.log(assignmentRows);
      assignmentRows.map(async (a) => {
        const userQuery = `
          SELECT role FROM user
          WHERE id = ?
        `;
        
        const [rows] = await connection.execute(userQuery, [a.taskForceID]);
        console.log('Line 155:', rows);

        rows.map(async (r) => {
          if(r.role === 'Task Force Chair') {
            await insertAssignment({
              userId: a.taskForceID,
              accredInfoId: a.accredID,
              levelId: a.levelID,
              programId: a.programID,
              areaId: a.areaID,
              parameterId,
              subParameterId: null,
              indicatorId: null
            }, connection);
          }
        })
      });

    } catch (error) {
      console.error(error);
    }
    // End
    
    await connection.commit();
    return { programAreaMappingId, parameterId };

  } catch (error) {
    console.error(error);
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      const duplicateError = new Error('DUPLICATE_ENTRY');
      duplicateError.duplicateValue = parameter;
      throw duplicateError;
    }
    
    throw error;

  } finally {
    connection.release();
  }
};

export default insertAreaParameterMapping;

