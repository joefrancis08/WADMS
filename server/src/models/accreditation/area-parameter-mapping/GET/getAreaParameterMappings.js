import db from "../../../../config/db.js";

const getAreaParameterMappings = async ({ 
  title, 
  year, 
  accredBody, 
  level, 
  program, 
  area, 
  connection = null
}) => {
  const query = `
    SELECT
      apm.id            AS apmId,
      ai.id             AS accredInfoId,
      ai.title          AS accred_title,
      ai.year           AS accred_year,
      ab.name           AS accred_body_name,
      al.id             AS levelId,
      al.level_name     AS level,
      pr.id             AS programId,
      pr.program_name   AS program,
      a.id              AS areaId,
      a.area_name       AS area,
      pa.id             AS parameter_id,
      pa.uuid           AS parameter_uuid,
      pa.parameter_name AS parameter
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
    JOIN program pr
      ON ilpm.program_id = pr.id
    JOIN area a
      ON pam.area_id = a.id
    JOIN parameter pa
      ON apm.parameter_id = pa.id
    WHERE ai.title = ?
      AND ai.year = ?
      AND ab.name = ?
      AND al.level_name = ?
      AND pr.program_name = ?
      AND a.area_name = ?
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [
      title,
      year,
      accredBody,
      level,
      program,
      area
    ]);

    return result;

  } catch (error) {
    console.error('Error fetching parameters:', error);
    throw error;
  }
};

export default getAreaParameterMappings;