import db from "../../../../config/db.js";
import getAreaBy from "../../areas/GET/getAreaBy.js";
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

    // Step 1: Check if a parameter exist, if not, insert it.
    const parameterResult = await getParameterBy('parameter_name', parameter, connection);

    let parameterId;
    if (parameterResult.length > 0) {
      parameterId = parameterResult[0].id;

    } else {
      const areaResult = await getAreaBy('area_name', area, connection);

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

    await connection.commit();
    return { programAreaMappingId, parameterId };

  } catch (error) {
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

