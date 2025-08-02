import db from "../../../config/db.js";

export const insertUserModel = async (userUUID, fullName, email, password, role, status) => {
  const sql = `
    INSERT INTO user (user_uuid, full_name, email, password, role, status)
    VALUES (?, ?, ?, ?, ?, ?)  
  `;

  const [result] = await db.execute(sql, [userUUID, fullName, email, password, role, status]);
  return result;
};