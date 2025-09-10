import db from "../../../../config/db.js";
import uuidBase64 from "../../../../utils/shortUUID.js";

/* 
  Insert Start and End Date into Accreditation Period Table.
  Use connection to include this query in a transaction
  with other query like inserting into program.
*/
const insertPeriod = async (startDate, endDate, connection = null) => {
  const periodUUID = uuidBase64();
  const query = 'INSERT INTO accreditation_period (uuid, start_date, end_date) VALUES (?, ?, ?)';

  try {
    // Check if period already exists
    const checkQuery = `
      SELECT id FROM accreditation_period
      WHERE start_date = ?
        AND end_date = ?
    `;

    const [exists] = await connection.execute(checkQuery, [startDate, endDate]);
    if (exists.length > 0) {
      const error = new Error('DUPLICATE_ENTRY');
      error.duplicateValue = [startDate, endDate]; // Attach the period start and end date
      throw error;
    }

    let result;

    if (connection) {
      [result] = await connection.execute(query, [periodUUID, startDate, endDate]);

    } else {
      [result] = await db.execute(query, [periodUUID, startDate, endDate]);
    }

    return result;

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const duplicateError = new Error('DUPLICATE_ENTRY');
      duplicateError.duplicateValue = [startDate, endDate];
      throw duplicateError;
    }

    throw error;
  }
};

export default insertPeriod;