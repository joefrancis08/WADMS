import db from "../../../config/db";

export const updateUserModel = async (fullName, email, password, role, status, id) => {
  const sql = 'UPDATE user SET full_name = ?, email = ?, password = ?, role = ?, status = ?  WHERE id = ?';

  const [result] = await db.execute(sql, [fullName, email, password, role, status, id])
  return result;
}

export const updateUserRoleModel = async (uuid, role, status) => {
  const sql = 'UPDATE user SET role = ?, status = ? WHERE user_uuid = ?';

  const [result] = await db.execute(sql, [role, status, uuid]);
  return result;
}
