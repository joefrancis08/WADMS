import deleteProgramMapping from "../../../../models/accreditation/program-to-be-accredited/DELETE/deleteProgramMapping.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const deleteProgramToBeAccredited = async (req, res) => {
  try {
    const { periodId, levelId, programId } = req.body;
    const result = await deleteProgramMapping(periodId, levelId, programId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Program not found or already deleted.'
      });
    }

    // Notify frontend via WebSocket
    sendUpdate('programs-to-be-accredited-deleted');
    
    res.status(200).json({
      success: true,
      message: 'Program to be accredited deleted successfully.'
    });

  } catch (error) {
    console.error('Error deleting program to be accredited:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete program to be accredited.'
    });
  }
};

export default deleteProgramToBeAccredited;