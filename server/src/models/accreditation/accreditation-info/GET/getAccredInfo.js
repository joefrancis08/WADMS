import db from "../../../../config/db.js";

const getAccredInfo = async (connection = null) => {
  const query = `
    SELECT 
      uuid  AS accred_uuid,
      title AS accred_title,
      year  AS accred_year
    FROM accreditation_info
    ORDER BY year DESC
  `;

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query);
    return rows;

  } catch (error) {
    console.error('Error fetching accreditation info:', error);
    throw error;
  }
};

export default getAccredInfo;