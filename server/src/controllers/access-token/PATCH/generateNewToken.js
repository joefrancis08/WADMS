import db from "../../../config/db.js";
import updateToken from "../../../models/access-token/PATCH/updateToken.js";
import generateToken from "../../../utils/token.js";

const generateNewToken = async (req, res) => {
  const { userUUID } = req.query;

  const lookUpQuery = `
    SELECT id 
    FROM user
    WHERE user_uuid = ?
  `;

  try {
    const [rows] = await db.execute(lookUpQuery, [userUUID]);

    console.log(rows);

    if (!rows.length) {
      return res.status(404).json({
        message: `No user found with uuid ${userUUID}.`,
        success: false,
        errorCode: 'USER_NOT_FOUND'
      });

    }

    console.log(rows[0].id);

    const result = await updateToken(
      { 
        userId: rows[0].id, 
        token: generateToken(),
        expireAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }, 
      { updateToken: true }
    );

    console.log(result);
    if (result.affectedRows) {
      return res.status(200).json({
        message: 'New token generated successfully!',
        success: true
      });
    } 

  } catch (error) {
    console.error('Error generating new token:', error);
    throw error;
  }
};

export default generateNewToken;