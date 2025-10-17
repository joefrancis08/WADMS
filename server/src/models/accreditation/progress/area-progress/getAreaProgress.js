import db from "../../../../config/db.js";

const getAreaProgress = async () => {
  const query = `
    SELECT * FROM vw_area_progress
  `;

  try {
    const [progress] = await db.query(query);

    return progress;

  } catch (error) {
    console.error('Error getting area progress:', error);
    throw error;
  }
};

export default getAreaProgress;