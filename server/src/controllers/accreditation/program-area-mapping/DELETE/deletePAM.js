import deleteArea from "../../../../models/accreditation/program-area-mapping/DELETE/deletePAM.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const deletePAM = async (req, res) => {
  const { title, year, accredBody, level, program, area } = req.query;

  console.log({
    title,
    year, 
    accredBody, 
    level,
    program,
    area
  });

  try {
    const response = await deleteArea({
      title,
      year,
      accredBody,
      level,
      program,
      area
    });
    const deletedArea = response?.deletedArea;
    const deletedCount = response?.deletedCount || 0;

    if (deletedCount === 0) {
      return res.status(404).json({
        message: `No matching records found for ${area}.`,
        success: false,
        deletedCount,
      });
    }

    sendUpdate('program-area-update');

    res.status(200).json({
      message: `${deletedArea} deleted successfully!`,
      success: true,
      deletedCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while deleting the record.',
      success: false,
      error: error.message
    });
  }
};

export default deletePAM;