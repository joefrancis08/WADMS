import getAreaProgress from "../../../models/accreditation/progress/area-progress/getAreaProgress.js";

const fetchAreaProgress = async (req, res) => {
  try {
    const areaProgressData = await getAreaProgress();

    res.status(200).json({
      message: 'Area progress fetched successfully!',
      success: true,
      areaProgressData
    });

  } catch (error) {
    console.error('Error fetching area progress:', error);

    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false,
      errorCode: 'SERVER_ERROR'
    });
  }
};

export default fetchAreaProgress;