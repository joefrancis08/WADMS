import db from '../../../config/db.js';

const insertAccessToken = async ({ token, expireAt, isUsed, userId, connection = null }) => {
  const query = `
    INSERT INTO access_token (token, expire_at, is_used, user_id)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const executor = connection || db;
    const result = await executor.execute(query, [token, expireAt, isUsed, userId]);

    console.log(result);

  } catch (error) {
    console.error('Error generating access token:', error);
    throw error;
  }
};

export default insertAccessToken;