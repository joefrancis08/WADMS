import db from "../../../config/db.js";

export const updateUserModel = async (profilePicPath, fullName, email, role, uuid) => {
  const sql = 'UPDATE user SET profile_pic_path = ?, full_name = ?, email = ?, role = ?  WHERE user_uuid = ?';

  const [result] = await db.execute(sql, [profilePicPath, fullName, email, role, uuid])
  return result;
}

export const updateUserRoleModel = async (uuid, role, status) => {
  const query = 'UPDATE user SET role = ?, status = ?, is_show_welcome = 1 WHERE user_uuid = ?';

  try {
    const [result] = await db.execute(query, [role, status, uuid]);
    return result;

  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
  
}
