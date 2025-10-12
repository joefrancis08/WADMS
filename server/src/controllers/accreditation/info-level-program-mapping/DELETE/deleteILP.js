import deleteILPModel from "../../../../models/accreditation/info-level-program-mapping/DELETE/deleteILP.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const deleteILP = async (req, res) => {
  const { title, year, accredBody, level = null, program = null } = req.query;

  try {
    const result = await deleteILPModel({
      title,
      year,
      accredBody,
      level,
      program
    });

    if (result === 0) {
      return res.status(404).json({
        message: 'No matching record to delete',
        success: false
      });
    }

    sendUpdate('info-level-program-update');

    res.status(200).json({
      message: `Deleted successfully!`,
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An unexpected error occured while deleting the record.',
      success: false
    });
  }
};

export default deleteILP;