import db from "../../../config/db.js";

const insertNotification = async ({ 
  userId, accredInfoId, levelId, 
  programId, areaId, parameterId, 
  subParameterId, title, type, 
}) => {
  console.log({ 
  userId, accredInfoId, levelId, 
  programId, areaId, parameterId, 
  subParameterId, title, type, 
});
  const query =  `
    INSERT INTO notification (
      user_id, accred_info_id, level_id, program_id, 
      area_id, parameter_id, subparameter_id, title, 
      type, is_read
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
  `;

  try {
    const [result] = await db.execute(query, [
      userId, accredInfoId, levelId, programId, 
      areaId, parameterId, subParameterId, 
      title, type
    ]);

    return result;
    
  } catch (error) {
    console.error('Error inserting OTP:', error);
    throw error;
  }
};

export default insertNotification;