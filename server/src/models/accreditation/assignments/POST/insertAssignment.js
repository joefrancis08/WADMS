import db from "../../../../config/db.js";

const insertAssignment = async (data, connection = null) => {
  const {
    userId,
    ilpmId,
    pamId, 
    apmId,
    pspmId,
    simId
  } = data;

  const query = `
    INSERT INTO accreditation_assignment (
      user_id,
      ilpm_id,
      pam_id,
      apm_id,
      pspm_id,
      sim_id
    )
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [
      userId,
      ilpmId,
      pamId,
      apmId,
      pspmId,
      simId
    ]);

    return result;

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const duplicateError = new Error('DUPLICATE_ENTRY');
      duplicateError.user = userId;
      throw duplicateError;
    }

    throw error;
  }
};

export default insertAssignment;