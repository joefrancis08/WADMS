import insertAreaParameterMapping from "../../../../models/accreditation/area-parameter-mapping/POST/insertAreaParameterMapping.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";
import isValidDateFormat from "../../../../utils/isValidDateFormat.js";

const addAreaParameterMapping = async (req, res) => {
  const { startDate, endDate, levelName, programName, areaName, parameterNames } = req.body;

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

    // Validate if levelName, programName, and areaName is a string
    if (typeof levelName !== 'string' || typeof programName !== 'string' || typeof areaName !== 'string') {
      return res.status(400).json({
        success: false, 
        message: 'Level, program, and area must be a string.'
      });
    }

    // Validate if levelName, programName, and areaName is not empty
    if (!levelName.trim() || !programName.trim() || !areaName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Level, program, and area must not be empty.'
      });
    }

    // Treat parameterNames as an array since 2 or more parameters can exist in one area
    const parameters = (Array.isArray(parameterNames) 
      ? parameterNames : [parameterNames])
      .map(p => p.trim())
      .filter(p => p.length > 0)
    ;

    // Validate if parameters array is not empty
    if (parameters.length === 0 || !parameterNames) {
      return res.status(400).json({
        success: false,
        message: 'Area names must not be empty.'
      });
    }

    // Store the results of each insertion
    const results = [];
    for (const parameterName of parameters) {
      // Insert each parameter into the database with its associated period, level, program, and area
      const response = await insertAreaParameterMapping(startDate, endDate, levelName, programName, areaName, parameterName);
      results.push(response); // Collect the response for reporting back to client
    }

    // Notify frontend via WebSocket
    sendUpdate('area-parameter-update');

    // Send success response back to the client with all inserted results
    res.status(200).json({
      success: true,
      message: 'Parameters added successfully.',
      results
    });

  } catch (error) {
    // Catch duplicate entry
    if (error.message === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        duplicateValue: error.duplicateValue,
        message: `${error.duplicateValue} already exist.`
      })
    }

    // Return other server errors
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error
    });
  }
};

export default addAreaParameterMapping;