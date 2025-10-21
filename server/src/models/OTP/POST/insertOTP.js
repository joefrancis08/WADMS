import db from "../../../config/db.js";

const insertOTP = async ({ otpCode, expiresAt, userId }) => {
  console.log({ otpCode, expiresAt, userId })
  const query = `
    INSERT INTO otp (otp_code, expires_at, user_id)
    VALUES (?, ?, ?)
  `;

  try {
    const [result] = await db.execute(query, [otpCode, expiresAt, userId]);
    return result;

  } catch (error) {
    console.error('Error inserting OTP:', error);
    throw error;
  }
};

export default insertOTP;