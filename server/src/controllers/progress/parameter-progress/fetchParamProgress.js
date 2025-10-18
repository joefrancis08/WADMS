import getParamProgress from "../../../models/accreditation/progress/parameter-progress/getParamProgress.js";

const fetchParamProgress = async (req, res) => {
  const { areaId } = req.query;

  if (!areaId) {
    return res.status(400).json({
      message: 'Area id is required and should be valid.',
      success: false
    });
  }

  try {
    const paramProgressData = await getParamProgress(areaId);

    res.status(200).json({
      message: 'Parameter progress fetched successfully!',
      success: true,
      paramProgressData
    });

  } catch (error) {
    console.error('Error fetching parameter progress:', error);

    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false,
      errorCode: 'SERVER_ERROR'
    });
  }
};

export default fetchParamProgress;