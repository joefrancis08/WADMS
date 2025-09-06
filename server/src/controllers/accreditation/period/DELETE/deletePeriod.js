import deletePeriod from "../../../../models/accreditation/period/DELETE/deletePeriod.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const deletePeriodFn = async (req, res) => {
  try {
    const {startDate, endDate} = req.query;

    // Validate params
    if (!startDate) return res.status(400).json({ success: false, message: 'startDate is required.' });
    if (!endDate) return res.status(400).json({ success: false, message: 'endDate is required.' });

    // Validate date format
    const isValidDate = (dateStr) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr));

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format.'
      });
    }

    const result = await deletePeriod(startDate, endDate, { isDeleteInMap: true });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Period does not exist or already deleted.'
      });
    }

    // Notify frontend via WebSocket
    sendUpdate('accreditation-period-update');

    res.status(200).json({
      success: true,
      message: 'Accreditation period deleted successfully.'
    });

  } catch (error) {
    console.error('Error deleting period:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete accreditation period.'
    });
  }
};

export default deletePeriodFn;