import db from "../../../config/db.js";

const updateOTP = async ({ otpCode, expiresAt, email }) => {
  const query = `
    UPDATE otp o
    JOIN user u ON o.user_id = u.id
    SET o.otp_code = ?, o.expires_at = ?
    WHERE u.email = ?
  `;

  try {
    const [rows] = await db.execute(query, [otpCode, expiresAt, email]);
    return rows;
    
  } catch (error) {
    console.error('Error updating OTP:', error);
    throw error;
  }
  
};

export default updateOTP;