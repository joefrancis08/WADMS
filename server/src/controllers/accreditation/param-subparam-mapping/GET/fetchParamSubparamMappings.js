import getParamSubparamMappings from "../../../../models/accreditation/param-subparam-mapping/GET/getParamSubparamMappings.js";

const fetchParamSubparamMappings = async (req, res) => {
  const { title, year, accredBody, level, program, area, parameter } = req.query;
  console.error('Parameter Subparameter:', { title, year, accredBody, level, program, area, parameter });
  try {
    const subParameters = await getParamSubparamMappings({ 
      title, 
      year, 
      accredBody, 
      level, 
      program, 
      area, 
      parameter 
    });
    res.status(200).json({
      success: true,
      data: subParameters
    });

  } catch (error) {
    console.error('Controller has error in fetching parameters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sub-parameters.'
    });
  }
};

export default fetchParamSubparamMappings;