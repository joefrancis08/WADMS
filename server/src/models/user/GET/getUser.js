import db from "../../../config/db.js";

// GET ALL Users
export const getAllUsersModel = async () => {
  const [rows] = await db.execute('SELECT * FROM user ORDER BY created_at DESC');
  return rows;
};

// GET User(s) By
export const getUserBy = async (column, value, single = true, isLogin = false) => {
  const allowedColumns = ['id', 'user_uuid', 'email', 'full_name', 'role', 'status'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column specified');
  }

  const query = `
    SELECT 
      id AS user_id,
      user_uuid, 
      profile_pic_path, 
      full_name, 
      email,
      password, 
      role,
      status,
      created_at 
    FROM user WHERE ${column} = ? 
      ${isLogin 
        ? "AND status = 'Verified'"
        : "AND role <> 'Unverified User'"
      }
    ORDER BY created_at DESC
  `;
  const [rows] = await db.execute(query, [value]);

  return single ? rows[0] : rows;
};

export const checkUserEmail = async (email) => {
  const user = await getUserBy('email', email);
  return !!user;
};