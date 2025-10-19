import getSubParamProgress from "../../../models/accreditation/progress/subparameter-progress/getSubParamProgress.js";

const fetchSubParamProgress = async (req, res) => {
  const { parameterId } = req.query;

  if (!parameterId) {
    return res.status(400).json({
      message: 'Parameter Id is required and should be valid.',
      success: false
    });
  }

  try {
    const subParamProgressData = await getSubParamProgress(parameterId);

    res.status(200).json({
      message: 'Sub-parameter progress fetched successfully!',
      success: true,
      subParamProgressData
    });

  } catch (error) {
    console.error('Error fetching sub-parameter progress:', error);

    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false,
      errorCode: 'SERVER_ERROR'
    });
  }
};

export default fetchSubParamProgress;