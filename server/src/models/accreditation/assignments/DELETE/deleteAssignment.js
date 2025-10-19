import db from "../../../../config/db.js";

const deleteAssignment = async (accredData = {}, userData = {}, condition = {}, connection = null) => {
  const { 
    ilpmId = null, 
    pamId = null, 
    apmId = null, 
    pspmId = null, 
    simId = null, 
  } = accredData;

  const {
    taskForceId = null
  } = userData;

  console.log('From model:', { 
    ilpmId,
    pamId,
    apmId,
    pspmId,
    simId
   });

  const {
    forDeanTaskForceDetailPage,
    forDeanAssignmentPage
  } = condition;

  // Build WHERE clause and params dynamically
  let whereClause = [];
  let params = [];

  if (forDeanTaskForceDetailPage) {
    whereClause.push('user_id = ?');
    params.push(taskForceId);
  }

  if (forDeanAssignmentPage) {
    if (ilpmId !== null) {
      whereClause.push('ilpm_id = ?');
      params.push(ilpmId);
    }
  }

  if (pamId !== null) {
      whereClause.push('pam_id = ?');
      params.push(pamId);
    }
    if (apmId !== null) {
      whereClause.push('apm_id = ?');
      params.push(apmId);
    }
    if (pspmId !== null) {
      whereClause.push('pspm_id = ?');
      params.push(pspmId);
    }
    if (simId !== null) {
      whereClause.push('sim_id = ?');
      params.push(simId);
    }

  const query = `
    DELETE FROM accreditation_assignment
    ${whereClause.length ? `WHERE ${whereClause.join(' AND ')}` : ''}
  `;

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query, params);

    return rows;

  } catch (error) {
    console.error('Error deleting assignment:', error);
    throw error;
  }
};

export default deleteAssignment;