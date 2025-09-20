import insertArea from "../../../../models/accreditation/areas/POST/insertArea.js";
import getLevelBy from "../../../../models/accreditation/level/GET/getLevelBy.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const addArea = async (req, res) => {
  try {
    const { areaName, levelName } = req.body;

    const levelResult = await getLevelBy('level_name', levelName);

    if (!levelResult.length) {
      return res.status(404).json({
        message: 'Level not found.',
        success: false
      });
    }

    const levelID = levelResult[0].id;

    if (!areaName || !isNaN(areaName)) {
      return res.status(400).json({
        message: 'Area name is required and should not a number.',
        success: false
      });
    }

    const response = await insertArea(areaName, levelID);

    sendUpdate('area-updates');
    
    res.status(200).json({
      message: 'Area added successfully.',
      success: true,
      response
    });
    
  } catch (error) {
    console.error('Error adding area:', error);
    res.status(500).json({
      message: 'Controller has an error.',
      success: false,
    });
  }
};

export default addArea;