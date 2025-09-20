import db from "../../../../config/db.js";

const getAccredInfo = async (connection = null) => {
  const query = `
    SELECT 
      ai.uuid    AS accred_uuid,
      ai.title   AS accred_title,
      ai.year    AS accred_year,
      ab.name    AS accred_body
    FROM accreditation_info ai
    JOIN accreditation_body ab
      ON ai.accreditation_body_id = ab.id
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