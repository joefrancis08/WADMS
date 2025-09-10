import db from "../../../../config/db.js";

const getAreas = async (connection = null) => {
  const query = `
    SELECT area_name AS area
    FROM area
  `;

  try {
    let result;

    if (connection) {
      [result] = await connection.execute(query);

    } else {
      [result] = await db.execute(query);
    }

    return result;

  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error; 
  }
};

export default getAreas;