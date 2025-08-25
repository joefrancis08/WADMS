import db from "../../../config/db.js";

const getPeriodBy = async (column, value, connection = db) => {
  const allowedColumns = ['id', 'start_date', 'end_date'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `
    SELECT id, start_date, end_date 
    FROM accreditation_period 
    WHERE ${column} = ?
  `;

  const [result] = await connection.execute(query, [value]);
  return result;
};

export default getPeriodBy;