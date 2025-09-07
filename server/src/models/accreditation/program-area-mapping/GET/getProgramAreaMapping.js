import db from "../../../../config/db.js";

const getProgramAreaMapping = async (startDate, endDate, levelName, programName, connection = null) => {
  const query = `
    SELECT
      a.uuid           AS area_uuid,
      ap.start_date    AS period_start,
      ap.end_date      AS period_end,
      al.level_name    AS level,
      pr.program_name  AS program,
      a.area_name      AS area
    FROM program_area_mapping pam
    JOIN program_level_mapping plm
      ON pam.program_level_mapping_id = plm.id
    JOIN accreditation_period ap
      ON plm.period_id = ap.id
    JOIN accreditation_level al
      ON plm.level_id = al.id
    JOIN program pr
      ON plm.program_id = pr.id
    JOIN area a
      ON pam.area_id = a.id
    WHERE ap.start_date = ?
      AND ap.end_date = ?
      AND al.level_name = ?
      AND pr.program_name = ?
  `;

  try {
    let result;
    if (connection) {
      [result] = await connection.execute(query, [startDate, endDate, levelName, programName]);

    } else {
      [result] = await db.execute(query, [startDate, endDate, levelName, programName]);
    }

    return result;
    
  } catch (error) {
    console.error("Error fetching programs to be accredited:", error);
    throw error;
  }
};

export default getProgramAreaMapping;