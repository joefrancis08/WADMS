import db from "../../../../config/db.js";

const getSubParamDocuments = async ({
  accredInfoId,
  levelId,
  programId,
  areaId,
  parameterId,
  subParameterId,
  connection = null
}) => {

  const query = `
    SELECT 
      ad.id             AS doc_id,
      ad.uuid           AS doc_uuid,
      ad.file_name,
      ad.file_path,
      ad.upload_by,
      ad.upload_at,
      ai.title          AS accred_title,
      ai.year           AS accred_year,
      ab.name           AS accred_body_name,
      al.level_name     AS level,
      pr.program_name   AS program,
      a.area_name       AS area,
      pa.parameter_name AS parameter,
      spa.id            AS sub_parameter_id,
      spa.uuid          AS sub_parameter_uuid
    FROM accreditation_documents ad
    JOIN accreditation_info ai
      ON ad.accred_info_id = ai.id
    JOIN accreditation_body ab
      ON ai.accreditation_body_id = ab.id
    JOIN accreditation_level al
      ON ad.level_id = al.id
    JOIN program pr
      ON ad.program_id = pr.id
    JOIN area a
      ON ad.area_id = a.id
    JOIN parameter pa
      ON ad.parameter_id = pa.id
    JOIN sub_parameter spa
      ON ad.subparameter_id = spa.id
    WHERE ad.accred_info_id = ?
      AND ad.level_id = ?
      AND ad.program_id = ?
      AND ad.area_id = ?
      AND ad.parameter_id = ?
      AND ad.subparameter_id = ?
      AND ad.indicator_id IS NULL
  `;

  try {
    const executor = connection || db;
    const [results] = await executor.query(query, [
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId,
      subParameterId
    ]);

    return {
      count: results.length,
      documents: results
    };

  } catch (error) {
    console.error('Error fetching sub-parameter document:', error);
    throw error;
  }
};

export default getSubParamDocuments;