import db from "../../../config/db.js";

// GET ALL Users
export const getAllUsersModel = async () => {
  const [rows] = await db.execute('SELECT * FROM user');
  return rows;
};

// GET User(s) By
export const getUserBy = async (column, value, single = true) => {
  const allowedColumns = ['user_uuid', 'email', 'role', 'status'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column specified');
  }

  const query = `SELECT * FROM user WHERE ${column} = ?`;
  const [rows] = await db.execute(query, [value]);

  return single ? rows[0] : rows;
}