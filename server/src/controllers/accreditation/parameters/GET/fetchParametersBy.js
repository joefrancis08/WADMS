import getParameterBy from "../../../../models/accreditation/parameters/GET/getParameterBy.js";

const fetchParametersBy = async (req, res) => {
  const { areaId } = req.query;

  try {
    const data = await getParameterBy('area_id', areaId);

    if (data.length === 0) {
      return res.status(404).json({
        message: `No parameters found with area id ${areaId}`,
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      parameters: data,
      count: data.length
    });

  } catch (error) {
    console.error('Controller has error fetching parameter by area id:', error);
    
    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false,
      errorCode: 'SERVER_ERROR'
    });
  }
};

export default fetchParametersBy;