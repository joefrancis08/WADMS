import db from "../../../../config/db.js";
import getParameterBy from "../../parameters/GET/getParameterBy.js";
import getSubParameterBy from "../../sub-parameters/GET/getSubParameterBy.js";
import insertSubParameter from "../../sub-parameters/POST/insertSubParameter.js";

const insertParamSubparamMapping = async ({ 
  title, 
  year, 
  accredBody, 
  level, 
  program, 
  area, 
  parameter, 
  subParameter 
}) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Step 1: Check if a sub-parameter exist, if not, insert it.
    const subParamResult = await getSubParameterBy('sub_parameter_name', subParameter, connection);

    let subParamId;
    if (subParamResult.length > 0) {
      subParamId = subParamResult[0].id;

    } else {
      const paramResult = await getParameterBy('parameter_name', parameter, connection);

      if (!paramResult.length) {
        throw new Error('PARAMETER_NOT_FOUND');
      }

      const parameterID = paramResult[0].id;
      const newSubParameter = await insertSubParameter(subParameter, parameterID, connection);
      subParamId = newSubParameter.insertId;
    }

    // Step 2: Get the area_parameter_mapping id
    const areaParamMappingQuery = `
      SELECT apm.id
      FROM area_parameter_mapping apm
      JOIN program_area_mapping pam
        ON apm.program_area_mapping_id = pam.id
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
      JOIN parameter par
        ON apm.parameter_id = par.id
      WHERE ai.title = ?
        AND ai.year = ?
        AND ab.name = ?
        AND al.level_name = ?
        AND p.program_name = ?
        AND a.area_name = ?
        AND par.parameter_name = ?
    `;
    const [rows] = await connection.execute(areaParamMappingQuery, [
      title,
      year,
      accredBody,
      level,
      program,
      area,
      parameter
    ]);

    if (rows.length === 0) {
      throw new Error('AREA_PARAMETER_MAPPING_NOT_FOUND');
    }

    const areaParamMappingId = rows[0].id;

    // Step 3: Insert parameter_subparameter_mapping
    const query = `
      INSERT INTO parameter_subparameter_mapping (area_parameter_mapping_id, subparameter_id)
      VALUES (?, ?)
    `;

    await connection.execute(query, [areaParamMappingId, subParamId]);

    await connection.commit();
    return { areaParamMappingId, subParamId };

  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      const duplicateError = new Error('DUPLICATE_ENTRY');
      duplicateError.duplicateValue = subParameter;
      throw duplicateError;
    }
    
    throw error;

  } finally {
    connection.release();
  }
};

export default insertParamSubparamMapping;