import db from "../../../../config/db.js";

const getAreaProgress = async (programId) => {
  const query = `
    SELECT 
      pam_id AS pamId,
      program_id AS programId,
      area_id AS areaId,
      ilpm_id AS ilpmId,
      progress
    FROM vw_area_progress WHERE program_id = ?
  `;

  try {
    const [progress] = await db.query(query, [programId]);

    return progress;

  } catch (error) {
    console.error('Error getting area progress:', error);
    throw error;
  }
};

export default getAreaProgress;