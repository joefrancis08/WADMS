import getProgramProgress from "../../../models/accreditation/progress/program-progress/getProgramProgress.js";


const fetchProgramProgress = async (req, res) => {
  try {
    const programProgressData = await getProgramProgress();

    res.status(200).json({
      message: 'Program progress fetched successfully!',
      success: true,
      programProgressData
    });

  } catch (error) {
    console.error('Error fetching program progress:', error);

    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false,
      errorCode: 'SERVER_ERROR'
    });
  }
};

export default fetchProgramProgress;
