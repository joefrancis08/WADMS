import db from "../../../../config/db.js";

const getParamProgress = async (areaId) => {
  const query = `
    SELECT 
      apm_id AS apmId,
      parameter_id AS parameterId,
      area_id AS areaId,
      pam_id AS pamId,
      progress
    FROM vw_parameter_progress WHERE area_id = ?
  `;

  try {
    const [progress] = await db.query(query, [areaId]);

    return progress;

  } catch (error) {
    console.error('Error getting parameter progress:', error);
    throw error;
  }
};

export default getParamProgress;