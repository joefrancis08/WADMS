import db from "../../../../config/db.js";

const getSubParamProgress = async (parameterId) => {
  const query = `
    SELECT 
      pspm_id AS pspmId,
      subparameter_id AS subParameterId,
      apm_id AS apmId,
      parameter_id AS parameterId,
      progress
    FROM vw_subparameter_progress WHERE parameter_id = ?
  `;

  try {
    const [progress] = await db.query(query, [parameterId]);

    return progress;

  } catch (error) {
    console.error('Error getting sub-parameter progress:', error);
    throw error;
  }
};

export default getSubParamProgress;