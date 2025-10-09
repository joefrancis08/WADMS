import deleteAPMModel from "../../../../models/accreditation/area-parameter-mapping/DELETE/deleteAPM.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const deleteAPM = async (req, res) => {
  const { id, parameter } = req.query;

  if (!id || isNaN(id) || !parameter || !parameter.trim()) {
    return res.status(400).json({
      message: 'Parameter id and parameter name should not be empty.',
      success: false,
      errorCode: 'EMPTY_FIELD'
    });
  }

  try {
    const response = await deleteAPMModel({
      id,
      parameter
    });
    const deletedParam = response?.deletedParam;
    const deletedCount = response?.deletedCount || 0;

    if (deletedCount === 0) {
      return res.status(404).json({
        message: `No matching records found for ${parameter}.`,
        success: false,
        deletedCount,
      });
    }

    sendUpdate('area-parameter-update');

    res.status(200).json({
      message: `${deletedParam} deleted successfully!`,
      success: true,
      deletedCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An unexpected error occured while deleting the record.',
      success: false,
      errorCode: 'SERVER_ERROR'
    });
  }
};

export default deleteAPM;