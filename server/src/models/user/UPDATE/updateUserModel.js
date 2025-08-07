import db from "../../../config/db.js";

export const updateUserModel = async (fullName, email, role, uuid) => {
  const sql = 'UPDATE user SET full_name = ?, email = ?, role = ?  WHERE user_uuid = ?';

  const [result] = await db.execute(sql, [fullName, email, role, uuid])
  return result;
}

export const updateUserRoleModel = async (uuid, role, status) => {
  const sql = 'UPDATE user SET role = ?, status = ? WHERE user_uuid = ?';

  const [result] = await db.execute(sql, [role, status, uuid]);
  return result;
}
