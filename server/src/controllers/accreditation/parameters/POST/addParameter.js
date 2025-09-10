import getAreaBy from "../../../../models/accreditation/areas/GET/getAreaBy.js";
import insertParameter from "../../../../models/accreditation/parameters/POST/insertParameter.js";

const addParameter = async (req, res) => {
  try {
    const { parameterName, areaName } = req.body;

    const areaResult = await getAreaBy('area_name', areaName);

    if (!areaResult.length) {
      return res.status(404).json({
        message: 'Area not found.',
        success: false
      });
    }

    const areaID = areaResult[0].id;

    if (!parameterName || !isNaN(areaName)) {
      return res.status(400).json({
        message: 'Parameter name is required and should not a number.',
        success: false
      });
    }

    const response = await insertParameter(parameterName, areaID);

    res.status(200).json({
      message: 'Parameter added successfully.',
      success: true,
      response
    });

  } catch (error) {
    console.error('Error adding parameter:', error);
    res.status(500).json({
      message: 'Controller has an error.',
      success: false
    });
  }
};

export default addParameter;