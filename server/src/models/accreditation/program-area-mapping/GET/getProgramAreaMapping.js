import db from "../../../../config/db.js";

const getProgramAreaMapping = async ({ title, year, accredBody, level, program, connection = null }) => {
  const query = `
    SELECT
      ai.title,
      ai.year,
      ab.name          AS accred_body,
      al.level_name    AS level,
      p.program_name   AS program,
      a.uuid           AS area_uuid,
      a.area_name      AS area
    FROM program_area_mapping pam
    LEFT JOIN info_level_program_mapping ilpm
      ON pam.info_level_program_mapping_id = ilpm.id
    LEFT JOIN accreditation_info ai
      ON ilpm.accreditation_info_id = ai.id
    LEFT JOIN accreditation_body ab
      ON ai.accreditation_body_id = ab.id
    LEFT JOIN accreditation_level al
      ON ilpm.level_id = al.id
    LEFT JOIN program p
      ON ilpm.program_id = p.id
    LEFT JOIN area a
      ON pam.area_id = a.id
    WHERE ai.title = ?
      AND ai.year = ?
      AND ab.name = ?
      AND al.level_name = ?
      AND p.program_name = ?
    ORDER BY
      FIELD(
        TRIM(
          SUBSTRING_INDEX(
            SUBSTRING_INDEX(a.area_name, ':', 1),
            '-', 1
          )
        ),
        'AREA I',
        'AREA II',
        'AREA III',
        'AREA IV',
        'AREA V',
        'AREA VI',
        'AREA VII',
        'AREA VIII',
        'AREA IX',
        'AREA X',
        'AREA XI',
        'AREA XII',
        'AREA XIII',
        'AREA XIV',
        'AREA XV',
        'AREA XVI',
        'AREA XVII',
        'AREA XVIII',
        'AREA XIX',
        'AREA XX'
      )
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [
      title, 
      year, 
      accredBody, 
      level, 
      program
    ]);
    
    return result;
    
  } catch (error) {
    console.error('Error fetching program areas:', error);
    throw error;
  }
};

export default getProgramAreaMapping;