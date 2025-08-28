import db from "../../../../config/db.js";

const getPeriod = async (connection = db) => {
  const query = `
    SELECT 
      id AS period_id, 
      start_date AS period_start, 
      end_date AS period_end
    FROM 
      accreditation_period
    ORDER BY 
      start_date ASC
  `;

  try {
    const [rows] = await connection.execute(query);
    return rows;

  } catch (error) {
    console.error('Error fetching accreditation period.');
    throw error;
  }
};

export default getPeriod;
