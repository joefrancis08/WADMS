import db from "../../../../config/db.js";

const getIndicatorProgress = async(subParameterId) => {
  const query = `
    SELECT 
      sim_id AS simId,
      indicator_id AS indicatorId,
      pspm_id AS pspmId,
      subparameter_id AS subParameterId,
      progress
    FROM vw_indicator_progress WHERE subparameter_id = ?
  `;

  try {
    const [progress] = await db.query(query, [subParameterId]);

    return progress;

  } catch (error) {
    console.error('Error getting indicator progress:', error);
    throw error;
  }
};

export default getIndicatorProgress;