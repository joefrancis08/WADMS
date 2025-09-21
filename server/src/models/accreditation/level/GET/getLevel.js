import db from "../../../../config/db.js";

const getLevel = async (connection = null) => {
  const query = `
    SELECT id, level_name AS level 
    FROM accreditation_level  
    ORDER BY id ASC
  `;
  try {
    const executor = connection || db;
    const [result] = await executor.execute(query);
    return result;

  } catch (error) {
    console.error("Error fetching accreditation levels:", error);
    throw error;
  }
};

export default getLevel;