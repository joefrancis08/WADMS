import db from "../../../../config/db.js";

/* 
  This code here is temporary.
  This can be integrated to getUser.jsx
  but i don't know how so i just put it here.
 */
const getTaskForceMembers = async (data = {}, connection = null) => {
  const { 
    accredInfoId, 
    levelId, 
    programId, 
    areaId 
  } = data;
  const query = `
    SELECT
      u.id AS userId,
      u.user_uuid AS userUUID,
      u.profile_pic_path AS profilePicPath,
      u.full_name AS fullName,
      u.email,
      u.role
    FROM accreditation_assignment aa
    JOIN user u
      ON aa.user_id = u.id
    WHERE aa.accred_info_id = ?
      AND aa.level_id = ?
      AND aa.program_id = ?
      AND aa.area_id = ?
      AND u.role = ?
  `;

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query, [accredInfoId, levelId, programId, areaId, 'Task Force Member']);
    return rows;

  } catch (error) {
    console.error('Error getting task force members:', error);
    throw error;
  }
};

export default getTaskForceMembers;