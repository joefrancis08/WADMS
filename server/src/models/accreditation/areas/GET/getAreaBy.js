import db from "../../../../config/db.js";

const getAreaBy = async (column, value, connection = db) => {
  const allowedColumns = ['id', 'area_name'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `SELECT id, area_name FROM area WHERE ${column} = ?`;
  const [result] = await connection.execute(query, [value]);
  return result;
};

export default getAreaBy;