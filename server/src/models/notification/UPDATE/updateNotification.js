import db from "../../../config/db.js";

export const updateIsRead = async(notifId, userId) => {
  const query = `
    UPDATE notification
    SET is_read = 1
    WHERE id = ?
      AND user_id = ?
  `;

  try {
    const [rows] = await db.execute(query, [notifId, userId]);
    return rows;

  } catch (error) {
    console.error('Error updating is_read:', error);
    throw error;
  }
};