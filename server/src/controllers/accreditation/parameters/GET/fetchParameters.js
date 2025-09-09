import getParameters from "../../../../models/accreditation/parameters/GET/getParameters.js";

const fetchParameters = async (req, res) => {
  try {
    const parameters = await getParameters();
    res.status(200).json({
      success: true,
      data: parameters
    });

  } catch (error) {
    console.error('Controller has error in fetching parameters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parameters.'
    })
  }
};

export default fetchParameters;