import insertAccreditationInfo from "../../../../models/accreditation/accreditation-info/POST/insertAccreditationInfo.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const addAccreditationInfo = async (req, res) => {
  try {
    /* 
      Destructure the incoming data from the frontend thru req.body
      Expected format: {
        title: "AACCUP Accreditation",
        year: "2025"
        accredBody: "AACCUP"
      }
    */
    const { title, year, accredBody } = req.body;

    // Validate title and accredBody
    if (!title?.trim() || !accredBody?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title and Accreditation Body are required and must not be empty.'
      });
    }

    // Validate year
    if (!year || isNaN(year) || year.toString().length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid 4-digit number.'
      });
    }

    // Insert accreditation info
    await insertAccreditationInfo(title, year, accredBody);

    sendUpdate('accreditation-info-update');

    res.status(200).json({
      success: true,
      message: 'Accreditation info added successfully.',
    });

  } catch (error) {
    // Catch duplicate entry
    if (error.message === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        duplicateValue: error.duplicateValue,
        message: 'Duplicate entry.'
      });
    }

    console.error('Error in addAccreditationInfo:', error);

    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
};

export default addAccreditationInfo;