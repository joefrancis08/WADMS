import db from "../../../../config/db.js";

const updateAssignment = async (data = {}, connection = null) => {
  const { 
    userId, ilpmId, pamId, 
    apmId = null, pspmId = null,
    simId = null
  } = data;

  const query = `
    UPDATE accreditation_assignment
    SET apm_id = ?, pspm_id = ?, sim_id = ?
    WHERE user_id = ?
      AND ilpm_id = ?
      AND pam_id = ?
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [
      apmId, pspmId, simId, userId,
      ilpmId, pamId
    ]);

    return result;

  } catch (error) {
    console.error('Error in updateAssignment.js:', error);
    throw error;
  }
};

export default updateAssignment;