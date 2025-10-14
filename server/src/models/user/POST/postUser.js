import db from "../../../config/db.js";

export const insertUserModel = async (data = {}) => {
  const { 
    userUUID, 
    profilePicPath, 
    fullName, 
    email, 
    password, 
    role, 
    status 
  } = data;
  
   console.log('To be inserted user data:', {userUUID, profilePicPath, fullName, email, password, role, status})
  const sql = `
    INSERT INTO user (user_uuid, profile_pic_path, full_name, email, password, role, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)  
  `;

  console.log('To be inserted user data:', {userUUID, profilePicPath, fullName, email, password, role, status})

  try {
    
    const [result] = await db.execute(sql, [userUUID, profilePicPath, fullName, email, password, role, status]);

   
    return result;

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
        const duplicateError = new Error('DUPLICATE_ENTRY');
        duplicateError.duplicateValue = email;
        throw duplicateError;
    }
    console.error('Error inserting user:', error);
    throw error;
  }
};