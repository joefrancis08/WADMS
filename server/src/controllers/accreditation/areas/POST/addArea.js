import insertArea from "../../../../models/accreditation/areas/POST/insertArea.js";

const addArea = async (req, res) => {
  try {
    const { areaName } = req.body;

    if (!areaName || !isNaN(areaName)) {
      return res.status(400).json({
        message: 'Area name is required and should not a number.',
        success: false
      });
    }

    const response = await insertArea(String(areaName).toUpperCase());
    
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