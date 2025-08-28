import db from "../../../../config/db.js";

export const getLevel = async (connection = db) => {
  const query = `SELECT level_name AS level FROM accreditation_level`;
  try {
    const [result] = await connection.execute(query);
    return result;

  } catch (error) {
    console.error("Error fetching accreditation levels:", error);
    throw error;
  }
};