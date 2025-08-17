import db from "../../../config/db.js";

export const insertUserModel = async (userUUID, profilePicPath, fullName, email, role) => {
  const sql = `
    INSERT INTO user (user_uuid, profile_pic_path, full_name, email, role)
    VALUES (?, ?, ?, ?, ?)  
  `;

  const [result] = await db.execute(sql, [userUUID, profilePicPath, fullName, email, role]);
  return result;
};