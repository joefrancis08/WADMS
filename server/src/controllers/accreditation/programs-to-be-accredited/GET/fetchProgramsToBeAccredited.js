import { getProgramsToBeAccredited } from "../../../../models/accreditation/program-to-be-accredited/GET/getProgramToBeAccredited.js";

const fetchProgramsToBeAccredited = async (req, res) => {
  try {
    const programs = await getProgramsToBeAccredited();
    res.status(200).json({
      success: true,
      data: programs
    });

  } catch (error) {
    console.error('Controller has error in fetching program: ', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programs to be accredited.'
    });
  }
};

export default fetchProgramsToBeAccredited;