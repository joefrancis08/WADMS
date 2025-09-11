import db from "../../../../config/db.js";
import getParameterBy from "../../parameters/GET/getParameterBy.js";
import getSubParameterBy from "../../sub-parameters/GET/getSubParameterBy.js";
import insertSubParameter from "../../sub-parameters/POST/insertSubParameter.js";

const insertParamSubparamMapping = async (startDate, endDate, level, program, area, parameter, subParameter) => {
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
      JOIN program_level_mapping plm
        ON pam.program_level_mapping_id = plm.id
      JOIN accreditation_period ap
        ON plm.period_id = ap.id
      JOIN accreditation_level al
        ON plm.level_id = al.id
      JOIN program p
        ON plm.program_id = p.id
      JOIN area a
        ON pam.area_id = a.id
      JOIN parameter par
        ON apm.parameter_id = par.id
      WHERE ap.start_date = ?
        AND ap.end_date = ?
        AND al.level_name = ?
        AND p.program_name = ?
        AND a.area_name = ?
        AND par.parameter_name = ?
    `;
    const [rows] = await connection.execute(areaParamMappingQuery, [startDate, endDate, level, program, area, parameter]);

    if (rows.length === 0) {
      throw new Error('AREA_PARAMETER_MAPPING_NOT_FOUND');
    }

    const areaParamMappingId = rows[0].id;

    // Step 3: Check if parameter_subparameter_mapping already exists
    const checkQuery = `
      SELECT id FROM parameter_subparameter_mapping 
      WHERE area_parameter_mapping_id = ?
      AND subparameter_id = ?
    `;
    const [exists] = await connection.execute(checkQuery, [areaParamMappingId, subParamId]);
    if (exists.length > 0) {
      const error = new Error('Duplicate entry');
      error.code = 'DUPLICATE_ENTRY';
      error.duplicateValue = subParameter;
      throw error;
    }

    // Step 4: Insert parameter_subparameter_mapping
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