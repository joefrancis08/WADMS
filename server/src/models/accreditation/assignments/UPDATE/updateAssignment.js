import db from "../../../../config/db.js";

const updateAssignment = async (data = {}, connection = null) => {
  const { 
    taskForceId, accredInfoId, levelId, programId, 
    areaId, parameterId, subParameterId, indicatorId 
  } = data;

  const query = `
    UPDATE accreditation_assignment
    SET parameter_id = ?, sub_parameter_id = ?, indicator_id = ?
    WHERE user_id = ?
      AND accred_info_id = ?
      AND level_id = ?
      AND program_id = ?
      AND area_id = ?
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [
      parameterId, subParameterId, indicatorId,
      taskForceId, accredInfoId, levelId,
      programId, areaId
    ]);

    return result;

  } catch (error) {
    console.error('Error in updateAssignment.js:', error);
    throw error;
  }
};

export default updateAssignment;