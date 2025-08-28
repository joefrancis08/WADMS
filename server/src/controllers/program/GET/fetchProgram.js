import getProgram from "../../../models/programs/GET/getProgram.js";

const fetchProgram = async (req, res) => {
  try {
    const programs = await getProgram();
    res.status(200).json({
      success: true,
      data: programs
    });
  } catch (error) {
    console.error('Controller has error in fetching programs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programs.'
    });
  }
};

export default fetchProgram;