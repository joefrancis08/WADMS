import db from "../../../../config/db.js";

const getProgramProgress = async () => {
  const query = `
    SELECT * FROM vw_program_progress
  `;

  try {
    const [program] = await db.query(query);

    return program;

  } catch (error) {
    console.error('Error getting program progress:', error);
    throw error;
  }
};

export default getProgramProgress;
