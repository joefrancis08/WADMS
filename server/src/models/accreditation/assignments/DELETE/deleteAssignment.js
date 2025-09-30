import db from "../../../../config/db.js";

const deleteAssignment = async (accredData = {}, userData = {}, condition = {}, connection = null) => {
  const { 
    accredInfoId = null, 
    levelId = null, 
    programId = null, 
    areaId = null, 
    parameterId = null, 
    subParameterId = null, 
    indicatorId = null
  } = accredData;

  const {
    userId = null
  } = userData;

  const {
    forDeanTaskForceDetailPage,
    forDeanAssignmentPage
  } = condition;

  // Build WHERE clause and params dynamically
  let whereClause = [];
  let params = [];

  if (forDeanTaskForceDetailPage) {
    whereClause.push('user_id = ?');
    params.push(userId);
  }

  if (forDeanAssignmentPage) {
    if (accredInfoId !== null) {
      whereClause.push('accred_info_id = ?');
      params.push(accredInfoId);
    }
  }

  if (levelId !== null) {
      whereClause.push('level_id = ?');
      params.push(levelId);
    }
    if (programId !== null) {
      whereClause.push('program_id = ?');
      params.push(programId);
    }
    if (areaId !== null) {
      whereClause.push('area_id = ?');
      params.push(areaId);
    }
    if (parameterId !== null) {
      whereClause.push('parameter_id = ?');
      params.push(parameterId);
    }
    if (subParameterId !== null) {
      whereClause.push('sub_parameter_id = ?');
      params.push(subParameterId);
    }
    if (indicatorId !== null) {
      whereClause.push('indicator_id = ?');
      params.push(indicatorId);
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