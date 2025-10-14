import db from "../../../../config/db.js";

const insertAssignment = async (data, connection = null) => {
  const {
    userId,
    accredInfoId,
    levelId,
    programId,
    areaId,
    parameterId,
    subParameterId,
    indicatorId
  } = data;

  const query = `
    INSERT INTO accreditation_assignment (
      user_id,
      accred_info_id,
      level_id,
      program_id,
      area_id,
      parameter_id,
      sub_parameter_id,
      indicator_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [
      userId,
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId,
      subParameterId,
      indicatorId
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