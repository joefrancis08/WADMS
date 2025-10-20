import db from "../../../config/db.js";

// GET ALL Users
export const getUsers = async (condition = {}) => {
  const { forTaskForce } = condition;

  let whereClause = '1=1'; // Default (no filter)

  if (forTaskForce) {
    // Only Chairs and Members
    whereClause = `
      role IN ('Task Force Chair', 'Task Force Member') AND 
      status = 'Verified'
    `;
  }

  const query = `
    SELECT 
      id,
      user_uuid         AS uuid,
      profile_pic_path  AS profilePicPath,
      full_name         AS fullName,
      email,
      role,
      status,
      created_at
    FROM user
    WHERE ${whereClause}
    ORDER BY 
    CASE 
      WHEN role = 'Task Force Chair' THEN 1
      WHEN role = 'Task Force Member' THEN 2
      ELSE 3
    END,
    created_at DESC
  `;

  try {
    const [rows] = await db.execute(query);
    return rows;

  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};


// GET User(s) By
export const getUserBy = async (column, value, single = true, isLogin = false, includeUnverified = false, is) => {
  const allowedColumns = ['id', 'user_uuid', 'email', 'full_name', 'role', 'status', 'is_show_welcome'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column specified');
  }

  const roleFilter = includeUnverified ? '' : "AND role <> 'Unverified User'";

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
      is_show_welcome,
      created_at 
    FROM user 
    WHERE ${column} = ? 
      ${isLogin ? "AND status = 'Verified'" : roleFilter}
    ORDER BY created_at DESC
  `;

  const [rows] = await db.execute(query, [value]);
  return single ? rows[0] : rows;
};

export const checkUserEmail = async (email) => {
  const user = await getUserBy('email', email);
  return !!user;
};