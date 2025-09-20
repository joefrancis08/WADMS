import db from "../../../../config/db.js";

const getAreaDocument = async (data = {}, connection = null) => {
  const {
    title,
    year,
    accredBody,
    level,
    program,
    area
  } = data;

  const query = `
    SELECT 
      ad.uuid,
      ad.file_name,
      ad.file_path,
      ad.upload_by,
      ad.upload_at,
      ai.title          AS accred_title,
      ai.year           AS accred_year,
      ab.name           AS accred_body_name,
      al.level_name     AS level,
      pr.program_name   AS program,
      a.area_name      AS area
    FROM accreditation_document ad
    JOIN program_area_mapping pam
      ON ad.program_area_mapping_id = pam.id
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
    WHERE ai.title = ?
      AND ai.year = ?
      AND ab.name = ?
      AND al.level_name = ?
      AND pr.program_name = ?
      AND a.area_name = ?
      AND ad.program_area_mapping_id IS NOT NULL
      AND ad.area_parameter_mapping_id IS NULL
      AND ad.param_subparam_mapping_id IS NULL
      AND ad.subparam_indicator_mapping_id IS NULL
  `;

  try {
    const executor = connection || db;
    const [results] = await executor.query(query, [
      title,
      year,
      accredBody,
      level,
      program,
      area
    ]);

    return {
      count: results.length,
      documents: results
    };

  } catch (error) {
    console.error('Error fetching area document:', error);
    throw error;
  }
};

export default getAreaDocument;