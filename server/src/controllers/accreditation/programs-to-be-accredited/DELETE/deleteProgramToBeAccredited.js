import deleteProgramMapping from "../../../../models/accreditation/program-to-be-accredited/DELETE/deleteProgramMapping.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const deleteProgramToBeAccredited = async (req, res) => {
  try {
    const { startDate, endDate, levelName, programName } = req.body;

    // Validate request body
    if (!startDate || !endDate || !levelName || !programName) {
      return res.status(400).json({
        success: false,
        message: 'startDate, endDate, levelName, and programName are required.'
      });
    }

    // Validate date format
    const isValidDate = (dateStr) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr));

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format.'
      });
    }

    const result = await deleteProgramMapping(startDate, endDate, levelName, programName);

    // Return 404 if program does not exist
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