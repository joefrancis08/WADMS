import db from "../../../../config/db";

const getAccredBody = async (connection = null) => {
  const query = `
    SELECT
      name
    FROM accreditation_body
    ORDER BY name
  `;

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query);
    return rows;

  } catch (error) {
    console.error('Error fetching accreditation bodies:', error);
    throw error;
  }
};

export default getAccredBody;