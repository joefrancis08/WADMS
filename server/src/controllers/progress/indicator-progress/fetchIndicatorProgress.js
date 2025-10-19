import getIndicatorProgress from "../../../models/accreditation/progress/indicator-progress/getIndicatorProgress.js";

const fetchIndicatorProgress = async (req, res) => {
  const { subParameterId } = req.query;

  if (!subParameterId) {
    return res.status(400).json({
      message: 'Sub-parameter Id is required and should be valid.',
      success: false
    });
  }

  try {
    const indicatorProgressData = await getIndicatorProgress(subParameterId);

    res.status(200).json({
      message: 'Indicator progress fetched successfully!',
      success: true,
      indicatorProgressData
    });

  } catch (error) {
    console.error('Error fetching indicator progress:', error);

    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false,
      errorCode: 'SERVER_ERROR'
    });
  }
};

export default fetchIndicatorProgress;