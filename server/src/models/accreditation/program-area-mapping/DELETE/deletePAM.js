import db from "../../../../config/db.js";

const deletePAM = async ({ title, year, accredBody, level, program, area }, connection = null ) => {
  
  const query = `
    DELETE pam 
    FROM program_area_mapping pam
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

    return {
      deletedArea: area,
      deletedCount: result.affectedRows
    };

  } catch (error) {
    console.error(error);
  }
  
};

export default deletePAM;