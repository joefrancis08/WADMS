import db from "../../../config/db.js";
import updateToken from "../../../models/access-token/PATCH/updateToken.js";

const verifyToken = async (req, res) => {
  const { token } = req.query; 

  if (!token) {
    return res.status(400).json({
      message: 'Token is required.',
      success: false,
    });
  }

  const tokenLookUpQuery = `
    SELECT 
      at.token, 
      at.expire_at, 
      at.is_used, 
      at.user_id,
      u.email,
      u.full_name,
      u.role,
      u.status
    FROM access_token at
    JOIN user u
      ON at.user_id = u.id
    WHERE token = ?
  `;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [tokenRecord] = await connection.execute(tokenLookUpQuery, [token]);

    if (!tokenRecord) {
      return res.status(401).json({
        message: 'Invalid token.',
        success: false,
      });
    }

    const { 
      expire_at, is_used, user_id, 
      email, full_name, role, status 
    } = tokenRecord[0];

    if (expire_at < new Date()) {
      return res.status(401).json({
        message: 'Token expired.',
        success: false,
        isExpired: true
      });
    }

    if (is_used) {
      return res.status(401).json({
        message: 'Token already used.',
        success: false,
        isUsed: true
      });
    }
    console.log(tokenRecord);

    await updateToken({ user_id }, { updateIsUsed: true });

    await connection.commit();
    
    req.session.user = {
      email,
      fullName: full_name,
      role,
      status
    };

    res.status(200).json({
      message: 'Valid token.',
      success: true,
      isValidToken: true,
      userId: tokenRecord[0].user_id
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error verifying token:', error);
    throw error;
  }
};

export default verifyToken;