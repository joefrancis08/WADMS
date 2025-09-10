import db from "../../../config/db.js";

const getProgram = async (connection = db) => {
  const query = `
    SELECT 
      uuid AS program_uuid,
      program_name AS program 
    FROM program 
    ORDER BY program_name ASC
  `;

  try {
    const [rows] = await connection.execute(query);
    return rows;

  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
};

export default getProgram;