import db from "../../../../config/db.js";

/* 
  Insert Start and End Date into Accreditation Period Table.
  Use connection to include this query in a transaction
  with other query like inserting into program.
*/
const insertPeriod = async (startDate, endDate, connection = db) => {
  const query = 'INSERT INTO accreditation_period (start_date, end_date) VALUES (?, ?)';
  const [result] = await connection.execute(query, [startDate, endDate]);
  return result;
};

export default insertPeriod;