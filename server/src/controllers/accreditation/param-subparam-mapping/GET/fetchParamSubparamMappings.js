import getParamSubparamMappings from "../../../../models/accreditation/param-subparam-mapping/GET/getParamSubparamMappings.js";

const fetchParamSubparamMappings = async (req, res) => {
  const { startDate, endDate, levelName, programName, areaName, parameterName } = req.query;

  try {
    const subParameters = await getParamSubparamMappings(startDate, endDate, levelName, programName, areaName, parameterName);
    res.status(200).json({
      success: true,
      data: subParameters
    });

  } catch (error) {
    console.error('Controller has error in fetching parameters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sub-parameters.'
    });
  }
};

export default fetchParamSubparamMappings;