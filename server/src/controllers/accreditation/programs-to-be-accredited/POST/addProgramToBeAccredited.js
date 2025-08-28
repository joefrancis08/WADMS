import insertProgramtoAccredit from '../../../../models/accreditation/program-to-be-accredited/POST/insertProgramtoAccredit.js';
import sendUpdate from '../../../../services/websocket/sendUpdate.js';
import isValidDateFormat from '../../../../utils/isValidDateFormat.js';

const addProgramToBeAccredited = async (req, res) => {
  try {
    /* 
      Destructure the incoming data from the request body
      Expected format: {
        startDate: "2025-08-25",
        endDate: "2025-08-30",
        levelName: "Level I", 
        programNames: ["BSIT", "BSBA"] 
      }
    */
    const { startDate, endDate, levelName, programNames } = req.body;

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

    // Validate if levelName is not empty
    if (!levelName || typeof levelName !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Level name must not be empty.'
      });
    }

    /* 
      Ensure programNames is always treated as an array
      If it's already an array, use it as is
      If it's a single string, wrap it inside an array
    */
    const programs = Array.isArray(programNames)
      ? programNames
      : [programNames];

    // Validate if program names array is not empty
    if (programs.length === 0 || !programNames) {
      return res.status(400).json({
        success: false,
        message: 'Program names must not be empty.',
      });
    }

    // Store the results of each insertion
    const results = [];
    for (const programName of programs) {
      // Insert each program into the database with its associated levelName
      const response = await insertProgramtoAccredit(startDate, endDate, levelName, programName);
      results.push(response); // Collect the response for reporting back to client
    }

    // Send success response back to the client with all inserted results
    res.status(200).json({
      success: true,
      message: 'Program to accredit added successfully.',
      results
    });

    sendUpdate('programs-to-be-accredited-update');
    
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

export default addProgramToBeAccredited;