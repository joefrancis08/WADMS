import getIndicatorBy from "../../../../models/accreditation/indicator/GET/getIndicatorBy.js";

const fetchIndicatorBy = async (req, res) => {
  const { subParamId } = req.query;

  try {
    const data = await getIndicatorBy('subparam_id', subParamId);

    if (data.length === 0) {
      return res.status(404).json({
        message: `No indicator found with subparameter id ${subParamId}`,
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      indicators: data,
      count: data.length
    });

  } catch (error) {
    console.error('Controller has error fetching indicators by subparameter id:', error);
    
    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false,
      errorCode: 'SERVER_ERROR'
    });
  }
};

export default fetchIndicatorBy;