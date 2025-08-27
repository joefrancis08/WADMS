import db from "../../../config/db.js";
import { getLevel } from "../../../models/accreditation/program-to-be-accredited/GET/getLevel.js";
import { insertLevel } from "../../../models/accreditation/program-to-be-accredited/POST/insertLevel.js";
import sendUpdate from "../../../services/websocket/sendUpdate.js";

// Get the request body from frontend and try to insert in program table
export const addLevel = async (req, res) => {
  try {
    const { levelName } = req.body;
    const response = await insertLevel(db, levelName);
    // console.log(response);
    // console.log(response.id);

    res.status(200).json({
      message: 'Accreditation level was added successfully.',
      success: true,
      response
    });

    sendUpdate('accreditation-levels-update');

  } catch (error) {
    console.error('Error adding level: ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
};

export const fetchLevels = async (req, res) => {
  try {
    const levels = await getLevel();
    res.status(200).json({
      success: true,
      data: levels
    });

  } catch (error) {
    console.error('Controller has error in fetching accreditation levels:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch accreditation levels.'
    });
  }
};