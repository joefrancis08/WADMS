import db from "../../../../config/db.js";

const getLevelBy = async (column, value, connection = db) => {
  const allowedColumns = ['id', 'level_name'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `SELECT id, level_name FROM accreditation_level WHERE ${column} = ?`;
  const [result] = await connection.execute(query, [value]);
  return result;
};

export default getLevelBy;