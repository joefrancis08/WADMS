import insertInfoLevelProgramMapping from "../../../../models/accreditation/info-level-program-mapping/POST/insertInfoLevelProgramMapping.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const addILP = async (req, res) => {
  const { title, year, accredBody, level, programNames } = req.body;
  const numYear = Number(year);

  try {
    // Validate title and accredBody
    if (!title?.trim() || !accredBody?.trim() || !level?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title, Accreditation Body, and Level are required and must not be empty.'
      });
    }

    // Validate year
    if (!/^\d{4}$/.test(numYear)) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid 4-digit number.'
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
    if (!programNames || programs.some(p => !p?.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Program name/s must not be empty.'
      });
    }

    // Store the results of each insertion
    const results = [];
    for (const programName of programs) {
      // Insert each program into the database with its associated levelName
      const response = await insertInfoLevelProgramMapping(title, numYear, accredBody, programName, level);
      results.push(response); // Collect the response for reporting back to client
    }

    // Notify frontend via WebSocket
    sendUpdate('info-level-program-update');

    // Send success response back to the client witl all inserted results
    res.status(200).json({
      success: true,
      message: 'Accreditation Info, Level, and Program/s added successfully.',
      results
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

    console.error(error);

    // Return other server errors
    res.status(500).json({
      success: false,
      message: 'An unexpected error occur.'
    });
  }
};

export default addILP;