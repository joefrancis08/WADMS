import db from "../../../config/db.js";
import uuidBase64 from "../../../utils/shortUUID.js";

/* 
  Insert Program into Program Table.
  Use connection to include this query in a transaction
  with other query like inserting into level.
*/
export const insertProgram = async (programName, connection = null) => {
  const programUUID = uuidBase64();
  const query = 'INSERT INTO program (uuid, program_name) VALUES (?, ?)';

  try {
    // Check if program exists
    const checkQuery = `
      SELECT id FROM program
      WHERE program_name = ?
    `;

    const [exists] = await connection.execute(checkQuery, [programName]);
    if (exists.length > 0) {
      const error = new Error('DUPLICATE_ENTRY');
      error.duplicateValue = programName; // Attach the program name
      throw error;
    }

    let result;

    if (connection) {
      [result] = await connection.execute(query, [programUUID, programName]);

    } else {
      [result] = await db.execute(query, [programUUID, programName]);
    }

    return result;

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const duplicateError = new Error('DUPLICATE_ENTRY');
      duplicateError.duplicateValue = programName;
      throw duplicateError;
    }

    throw error;
  }
};
