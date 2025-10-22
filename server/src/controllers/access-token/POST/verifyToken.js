import db from "../../../config/db.js";
import updateToken from "../../../models/access-token/PATCH/updateToken.js";
import JWTSign from "../../auth/helpers/jwtSign.js";

const verifyToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      message: "Token is required.",
      success: false,
    });
  }

  const tokenLookUpQuery = `
    SELECT 
      at.token, 
      at.expire_at, 
      at.is_used, 
      at.user_id,
      u.user_uuid,
      u.email,
      u.full_name,
      u.profile_pic_path,
      u.role,
      u.status
    FROM access_token at
    JOIN user u
      ON at.user_id = u.id
    WHERE at.token = ?
    LIMIT 1
  `;

  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(tokenLookUpQuery, [token]);

    // No matching token
    if (!rows || rows.length === 0) {
      return res.status(401).json({
        message: "Invalid token.",
        success: false,
      });
    }

    const record = rows[0];
    const {
      expire_at,
      is_used,
      user_id,
      user_uuid,
      email,
      full_name,
      profile_pic_path,
      role,
      status,
    } = record;

    // Ensure Date comparison is correct
    const now = new Date();
    const expireAt = expire_at instanceof Date ? expire_at : new Date(expire_at);

    if (isNaN(expireAt.getTime())) {
      // Unexpected data shape; treat as invalid
      return res.status(500).json({
        message: "Malformed token expiry date.",
        success: false,
      });
    }

    if (expireAt < now) {
      return res.status(401).json({
        message: "Token expired.",
        success: false,
        isExpired: true,
      });
    }

    if (is_used) {
      return res.status(401).json({
        message: "Token already used.",
        success: false,
        isUsed: true,
      });
    }

    // Mark token as used (wrap in a transaction in case updateToken touches DB)
    await connection.beginTransaction();
    await updateToken({ userId: user_id, token }, { updateIsUsed: true });
    await connection.commit();

    // Create session
    req.session.user = {
      userId: user_id,
      userUUID: user_uuid,
      email,
      fullName: full_name,
      profilePicPath: profile_pic_path,
      role,
      status,
    };

    const JWToken = JWTSign({
      userId: user_id,
      userUUID: user_uuid,
      email,
      fullName: full_name,
      profilePicPath: profile_pic_path,
      role,
      status,
    });

    return res.status(200).json({
      message: "Valid token.",
      success: true,
      isValidToken: true,
      token: JWToken,
      userData: req.session.user,
    });

  } catch (error) {
    try {
      await connection.rollback();
    } catch (_) {
      // ignore rollback errors
    }
    console.error("Error verifying token:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  } finally {
    connection.release();
  }
};

export default verifyToken;
