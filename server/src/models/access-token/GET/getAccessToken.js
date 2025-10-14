import db from "../../../config/db.js";

const getAccessToken = async (connection = null) => {
  const query = `
    SELECT 
      user_id AS userId,
      token AS accessToken,
      expire_at AS accessTokenExpiration,
      is_used AS isUsed
    FROM access_token
  `;

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query);
    return rows;

  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
};

export default getAccessToken;