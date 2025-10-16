import getSubParameterBy from "../../../../models/accreditation/sub-parameters/GET/getSubParameterBy.js";

const fetchSubparametersBy = async (req, res) => {
  const { parameterId } = req.query;

  try {
    const data = await getSubParameterBy('parameter_id', parameterId);

    if (data.length === 0) {
      return res.status(404).json({
        message: `No sub-parameters found with parameter id ${parameterId}`,
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      subParameters: data,
      count: data.length
    });
    
  } catch (error) {
    console.error('Controller has error fetching sub-parameter by parameter id:', error);
    
    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false,
      errorCode: 'SERVER_ERROR'
    });
  }
};

export default fetchSubparametersBy;