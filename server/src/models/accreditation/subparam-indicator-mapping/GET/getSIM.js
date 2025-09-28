import db from "../../../../config/db.js";

const getSIM = async ({
  title,
  year,
  accredBody,
  level,
  program,
  area,
  parameter,
  subParameter,
  connection = null
}) => {
  const query = `
    SELECT 
      sim.id,
      ai.title               AS accred_title,
      ai.year                AS accred_year,
      ab.name                AS accred_body_name,
      al.level_name          AS level,
      pr.program_name        AS program,
      a.area_name            AS area,
      pa.parameter_name      AS parameter,
      spa.sub_parameter_name AS sub_parameter,
      i.id                   AS indicator_id,
      i.uuid                 AS indicator_uuid,
      i.indicator_name       AS indicator
    FROM subparam_indicator_mapping sim
    JOIN parameter_subparameter_mapping pspm
      ON sim.param_subparam_mapping_id = pspm.id
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
    JOIN program pr
      ON ilpm.program_id = pr.id
    JOIN area a
      ON pam.area_id = a.id
    JOIN parameter pa
      ON apm.parameter_id = pa.id
    JOIN sub_parameter spa
      ON pspm.subparameter_id = spa.id
    JOIN indicator i
      ON sim.indicator_id = i.id
    WHERE ai.title = ?
      AND ai.year = ?
      AND ab.name = ?
      AND al.level_name = ?
      AND pr.program_name = ?
      AND a.area_name = ?
      AND pa.parameter_name = ?
      AND spa.sub_parameter_name = ?
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [
      title,
      year,
      accredBody,
      level,
      program,
      area,
      parameter,
      subParameter
    ]);

    return result;

  } catch (error) {
    console.error('Error fetching indicators:', error);
    throw error;
  }
};

export default getSIM;