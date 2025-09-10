import getAreaParameterMappings from "../../../../models/accreditation/area-parameter-mapping/GET/getAreaParameterMappings.js";

const fetchAreaParameterMappings = async (req, res) => {
  const { startDate, endDate, levelName, programName, areaName } = req.query;

  try {
    const parameters = await getAreaParameterMappings(startDate, endDate, levelName, programName, areaName);
    res.status(200).json({
      success: true,
      data: parameters
    });

  } catch (error) {
    console.error('Controller has error in fetching parameters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parameters.'
    });
  }
};

export default fetchAreaParameterMappings;