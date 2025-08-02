import db from "../../../config/db";

// DELETE ALL Users
export const deleteAllUsersModel = async () => {
  const [rows] = await db.execute('TRUNCATE TABLE user');
  return rows;
}

export const deleteUserByIdModel = async (uuid) => {
  const [result] = await db.execute('DELETE FROM user WHERE user_uuid = ?', [uuid]);
  return result;
};