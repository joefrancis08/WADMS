import deletePSPMModel from "../../../../models/accreditation/param-subparam-mapping/DELETE/deletePSPM.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const deletePSPM = async (req, res) => {
  const pspmId = Number(req.query.pspmId);
  const subParameterId = Number(req.query.subParameterId);
  const subParameter = req.query.subParameter;

  console.log({ pspmId, subParameterId, subParameter });

  if (!pspmId || !subParameterId || !subParameter || !subParameter.trim()) {
    return res.status(400).json({
      message: 'Subparameter id and subparameter name should not be empty.',
      success: false,
      errorCode: 'EMPTY_FIELD'
    });
  }

  try {
    const response = await deletePSPMModel({
      pspmId,
      subParameterId,
      subParameter
    });

    const deletedSubParam = response?.deletedSubParam;
    const deletedCount = response?.deletedCount || 0;

    if (deletedCount === 0) {
      return res.status(404).json({
        message: `No matching records for ${subParameter}.`,
        success: false,
        deletedCount,
      });
    }

    sendUpdate('parameter-subparameter-update');

    res.status(200).json({
      message: `${deletedSubParam} deleted successfully!`,
      success: true,
      deletedCount
    });

  } catch (error) {
    console.error('deletePSPM.js controller error:', error);
    res.status(500).json({
      message: 'An unexpected error occured while deleting the record.',
      success: false,
      errorCode: 'SERVER_ERROR'
    });
  }
};

export default deletePSPM;