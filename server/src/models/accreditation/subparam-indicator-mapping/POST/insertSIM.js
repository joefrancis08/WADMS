import db from "../../../../config/db.js";
import getIndicatorBy from "../../indicator/GET/getIndicatorBy.js";
import insertIndicator from "../../indicator/POST/insertIndicator.js";
import getSubParameterBy from "../../sub-parameters/GET/getSubParameterBy.js";

const insertSIM = async ({
  title,
  year,
  accredBody,
  level,
  program,
  area,
  parameter,
  subParameter,
  indicator
}) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Step 1: Check if an indicator already exist, if not, insert it.
    const indResult = await getIndicatorBy('indicator_name', indicator, connection);

    let indId;
    if (indResult.length > 0) {
      indId = indResult[0].id;

    } else {
      const subParamResult = await getSubParameterBy('sub_parameter_name', subParameter, connection);

      if (!subParamResult.length) {
        throw new Error('PARAMETER_NOT_FOUND');
      }

      const subParamId = subParamResult[0].id;
      const newIndicator = await insertIndicator(indicator, subParamId, connection);
      indId = newIndicator.insertId;
    }

    // Step 2: Get the param_subparam_mapping_id
    const psmQuery = `
      SELECT pspm.id
      FROM parameter_subparameter_mapping pspm
      JOIN area_parameter_mapping apm
        ON pspm.area_parameter_mapping_id = apm.id
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
      JOIN sub_parameter sp
        ON pspm.subparameter_id = sp.id
      WHERE ai.title = ?
        AND ai.year = ?
        AND ab.name = ?
        AND al.level_name = ?
        AND p.program_name = ?
        AND a.area_name = ?
        AND par.parameter_name = ?
        AND sp.sub_parameter_name = ?
    `;

    const [rows] = await connection.execute(psmQuery, [
      title,
      year,
      accredBody,
      level,
      program,
      area,
      parameter,
      subParameter
    ]);

    if (rows.length === 0) {
      throw new Error('PARAMETER_SUBPARAMETER_MAPPING_NOT_FOUND');
    }

    const psmId = rows[0].id;

    // Step 3: Insert subparam_indicator_mapping
    const query = `
      INSERT INTO subparam_indicator_mapping (param_subparam_mapping_id, indicator_id)
      VALUES (?, ?)
    `;

    await connection.execute(query, [psmId, indId]);
    await connection.commit();
    return { psmId, indId };

  } catch (error) {
    console.error(error);
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      const duplicateError = new Error('DUPLICATE_ENTRY');
      duplicateError.duplicateValue = indicator;
      throw duplicateError;
    }

    throw error;

  } finally {
    connection.release();
  }
};

export default insertSIM;