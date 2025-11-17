/* 
  This code here is temporary.
  This can be integrated to getUser.jsx
  but i don't know how so i just put it here.
 */
const getTaskForceMembers = () => {
  const query = `
    SELECT * FROM accreditation_assignment
    WHERE accred_info_id = ?
      AND level_id = ?
      AND program_id = ?
      AND area_id = ?
  `;
};

export default getTaskForceMembers;