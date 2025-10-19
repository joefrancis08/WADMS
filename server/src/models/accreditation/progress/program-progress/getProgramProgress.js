import db from "../../../../config/db.js";

const getProgramProgress = async () => {
  const query = `
    SELECT * FROM vw_program_progress
  `;

  try {
    const [progress] = await db.query(query);

    return progress;

  } catch (error) {
    console.error('Error getting program progress:', error);
    throw error;
  }
};

export default getProgramProgress;
