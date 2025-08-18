import db from "../../../config/db.js";

// GET ALL Users
export const getAllUsersModel = async () => {
  const [rows] = await db.execute('SELECT * FROM user ORDER BY created_at DESC');
  return rows;
};

// GET User(s) By
export const getUserBy = async (column, value, single = true) => {
  const allowedColumns = ['user_uuid', 'email', 'role', 'is_active'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column specified');
  }

  const query = `SELECT * FROM user WHERE ${column} = ? ORDER BY created_at DESC`;
  const [rows] = await db.execute(query, [value]);

  return single ? rows[0] : rows;
}