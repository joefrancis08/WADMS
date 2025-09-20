import db from "../../../../config/db.js";

const getIndicator = async (connection = null) => {
  const query = `
    SELECT indicator_name AS indicator
    FROM area
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query);

    return result;

  } catch (error) {
    console.error('Error getting area:', error);
    throw error;
  }
};

export default getIndicator;