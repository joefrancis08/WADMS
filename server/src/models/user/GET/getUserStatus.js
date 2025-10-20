import db from "../../../config/db.js";

const getUserStatus = async (userId, email) => {
  const query = `
    SELECT
      id AS userId,
      user_uuid AS userUUID,
      profile_pic_path AS profilePicPath,
      full_name  AS fullName,
      email,
      role,
      status,
      is_show_welcome
    FROM user
    WHERE id = ?
      AND email = ?
  `;

  try {
    const [rows] = await db.execute(query, [userId, email]);

    return rows[0];

  } catch (error) {
    console.error('Error checking user status: ', error);

    throw error;
  }
};

export default getUserStatus;