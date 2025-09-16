import db from "../../../../config/db.js";

const getLevel = async (connection = db) => {
  const query = `
    SELECT level_name AS level 
    FROM accreditation_level  
    ORDER BY
      FIELD('level_name', 'Preliminary', 'Level I', 'Level II', 'Level III', 'Level IV') 
  `;
  try {
    const [result] = await connection.execute(query);
    return result;

  } catch (error) {
    console.error("Error fetching accreditation levels:", error);
    throw error;
  }
};

export default getLevel;