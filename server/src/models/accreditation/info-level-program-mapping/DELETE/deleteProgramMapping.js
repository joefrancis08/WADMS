import db from "../../../../config/db.js";

const deleteProgramMapping = async (startDate, endDate, levelName, programName, connection = db ) => {
  // Query to delete program_level_mapping rows that tied to a specific period, level, and program
  const query = `
    DELETE plm
    FROM program_level_mapping plm
    JOIN accreditation_period ap ON plm.period_id = ap.id
    JOIN accreditation_level al ON plm.level_id = al.id
    JOIN program p ON plm.program_id = p.id
    WHERE DATE(ap.start_date) = ?
      AND DATE(ap.end_date) = ?
      AND al.level_name = ?
      AND p.program_name = ?
  `;

  try {
    const [rows] = await connection.execute(query, [startDate, endDate, levelName, programName]);
    return rows.affectedRows;

  } catch (error) {
    console.error('Error deleting program to be accredited:', error);
    throw error;
  }
};

export default deleteProgramMapping;