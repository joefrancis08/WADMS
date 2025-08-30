import db from "../../../../config/db.js";

const deleteProgramMapping = async (periodId, levelId, programId, connection = db  ) => {
  // Query to delete program that tied to a specific period and level
  const query = `
    DELETE FROM program_level_mapping
    WHERE period_id = ?
      AND level_id = ?
      AND program_id = ?
    LIMIT 1
  `;

  try {
    const [rows] = await connection.execute(query, [periodId,levelId, programId]);
    return rows.affectedRows;

  } catch (error) {
    console.error('Error deleting program to be accredited:', error);
    throw error;
  }
};

export default deleteProgramMapping;