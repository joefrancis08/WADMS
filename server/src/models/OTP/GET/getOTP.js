import db from "../../../config/db.js";

const getOTP = async (email) => {
  const query = `
    SELECT 
      o.id, 
      o.otp_code, 
      o.expires_at
    FROM otp o
    JOIN user u
      ON o.user_id = u.id
    WHERE u.email = ?
      AND expires_at > NOW()
      AND is_used = 0
    ORDER BY o.expires_at DESC
    LIMIT 1
  `;

  try {
    const [rows] = await db.execute(query, [email]);

    return rows[0] || null;

  } catch (error) {
    console.error('Error getting OTP:', error);
    throw error;
  }
};

export default getOTP;