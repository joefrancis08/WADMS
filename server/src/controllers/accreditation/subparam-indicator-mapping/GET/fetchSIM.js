import getSIM from "../../../../models/accreditation/subparam-indicator-mapping/GET/getSIM.js";

const fetchSIM = async (req, res) => {
  const { title, year, accredBody, level, program, area, parameter, subParameter } = req.query;

  console.log({ 
    title, 
    year, 
    accredBody, 
    level, 
    program, 
    area, 
    parameter, 
    subParameter 
  });

  try {
    const indicators = await getSIM({
      title,
      year,
      accredBody,
      level,
      program,
      area,
      parameter,
      subParameter
    });

    res.status(200).json({
      success: true,
      data: indicators
    });

  } catch (error) {
    console.error('Controller has error in fetching indicators:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch indicators.'
    });
  }
};

export default fetchSIM;