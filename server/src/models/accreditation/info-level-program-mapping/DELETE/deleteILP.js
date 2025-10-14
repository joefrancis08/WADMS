import db from "../../../../config/db.js";

const deleteILP = async ({ title, year, accredBody, level, program, connection = null }) => {
  // Query to delete info_level_program_mapping rows that tied to a specific title, year, accredBody, etc.
  const query = `
    DELETE ilpm
    FROM info_level_program_mapping ilpm
    JOIN accreditation_info ai
      ON ilpm.accreditation_info_id = ai.id
    JOIN accreditation_body ab
      ON ai.accreditation_body_id = ab.id
    JOIN accreditation_level al
      ON ilpm.level_id = al.id
    JOIN program p
      ON ilpm.program_id = p.id
    WHERE ai.title = ?
      AND ai.year = ?
      AND ab.name = ?
      AND (? IS NULL OR al.level_name = ?)
      AND (? IS NULL OR p.program_name = ?)
  `;

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query, [
      title,
      year,
      accredBody,
      level, level,
      program, program
    ]);
    return rows.affectedRows;

  } catch (error) {
    console.error('Error deleting program to be accredited:', error);
    throw error;
  }
};

export default deleteILP;