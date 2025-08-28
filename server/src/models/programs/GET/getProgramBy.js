import db from "../../../config/db.js";

const getProgramBy = async (column, value, connection = db) => {
  const allowedColumns = ['id', 'program_name'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');;
  }

  const query = `SELECT id, program_name FROM program WHERE ${column} = ?`;
  const [result] = await connection.execute(query, [value]);
  return result;
};

export default getProgramBy;