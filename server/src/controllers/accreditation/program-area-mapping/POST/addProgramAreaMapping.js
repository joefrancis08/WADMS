import insertProgramAreaMapping from "../../../../models/accreditation/program-area-mapping/POST/insertProgramAreaMapping.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const addProgramAreaMapping = async (req, res) => {
  const { startDate, endDate, levelName, programName, areaNames } = req.body;

  try {
    // Validate if date is not empty and in valid format (e.g., 2025-08-25)
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start and end date must not be empty.'
      });

    } else if (!isValidDateFormat(startDate) || !isValidDateFormat(endDate)) {
      return res.status(400).json({
        success:false,
        message: 'Invalid date format. Expected format: YYYY-MM-DD'
      });
    }

    // Validate if levelName and programName is not empty
    if (!levelName || !programName || typeof levelName !== 'string' || typeof programName !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Level and program name must not be empty.'
      });
    }

    // Treat areaNames as an array since there might be 2 or more areas
    const areas = Array.isArray(areaNames)
      ? areaNames
      : [areaNames]

    // Validate if program names array is not empty
    if (areas.length === 0 || !areaNames) {
      return res.status(400).json({
        success: false,
        message: 'Area names must not be empty.',
      });
    }

    // Store the results of each insertion
    const results = [];
    for (const areaName of areas) {
      // Insert each area into the database with its associated period, level, and program
      const response = await insertProgramAreaMapping(startDate, endDate, levelName, programName, areaName);
      results.push(response); // Collect the response for reporting back to client
    }

        // Notify frontend via WebSocket
    sendUpdate('program-area-update');

    // Send success response back to the client with all inserted results
    res.status(200).json({
      success: true,
      message: 'Program to be accredited area added successfully.',
      results
    });

  } catch (error) {
    // Catch duplicate entry
    if (error.message === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        message: 'Duplicate entry.'
      });
    }

    // Return other server errors
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error
    });
  }
};

export default addProgramAreaMapping;