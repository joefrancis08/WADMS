import db from "../../../config/db.js";

const updateToken = async (data = {}, condition = {}, connection = null) => {
  const { userId, token, expireAt } = data;
  const { updateIsUsed, updateToken } = condition;

  let query;
  if (updateIsUsed) {
    query = `
      UPDATE access_token
      SET is_used = 1
      WHERE user_id = ?
    `;

  } else if (updateToken) {
    query = `
      UPDATE access_token
      SET token = ?, expire_at = ?, is_used = 0
      WHERE user_id = ?
    `;

  } else if (updateIsUsed && updateToken) {
    query = `
      UPDATE access_token
      SET is_used = 1, token = ?
      WHERE user_id = ?
    `;
  }

  try {
    let rows;
    const executor = connection || db;
    if (updateIsUsed) {
      [rows] = await executor.execute(query, [userId]);

    } else if (updateToken) {
      [rows] = await executor.execute(query, [token, expireAt, userId]);

    } else if (updateIsUsed && updateToken) {
      [rows] = await executor.execute(query, [token, userId]);

    } else {
      throw new Error('Invalid condition.');
    }
    
    return rows;

  } catch (error) {
    console.error('Error updating access token:', error);
    throw error;
  }
};

export default updateToken;