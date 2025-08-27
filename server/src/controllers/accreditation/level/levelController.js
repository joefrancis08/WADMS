import db from "../../../config/db.js";
import { insertLevel } from "../../../models/accreditation/program-to-be-accredited/POST/insertLevel.js";

// Get the request body from frontend and try to insert in program table
export const addLevel = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { levelName } = req.body;
    const response = await insertLevel(connection, levelName);
    // console.log(response);
    // console.log(response.id);

    res.status(200).json({
      message: 'Accreditation level was added successfully.',
      success: true,
      response
    });

  } catch (error) {
    console.error('Error adding level: ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
};