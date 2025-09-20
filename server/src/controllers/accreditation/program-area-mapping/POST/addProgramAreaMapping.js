import insertProgramAreaMapping from "../../../../models/accreditation/program-area-mapping/POST/insertProgramAreaMapping.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const addProgramAreaMapping = async (req, res) => {
  const { title, year, accredBody, level, program, areaNames } = req.body;

  try {
    // Validate title, accredBody, level, and program
    if (!title?.trim() || !accredBody?.trim() || !level?.trim() || !program?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title, Accreditation Body, Level, and Programs are required and must not be empty.'
      });
    }

    // Validate year
    if (!/^\d{4}$/.test(year)) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid 4-digit number.'
      });
    }

    /* 
      Ensure areaNames is always treated as an array
      If it's already an array, use it as is
      If it's a single string, wrap it inside an array
    */
    const areas = (Array.isArray(areaNames) ? areaNames : [areaNames])
      .map(a => a.trim())
      .filter(a => a.length > 0);

    // Validate if area names array is not empty
    if (!areas.length) {
      return res.status(400).json({
        success: false,
        message: 'Area names must not be empty.',
      });
    }

    // Store the results of each insertion
    const results = [];
    for (const area of areas) {
      // Insert each area into the database with its associated period, level, and program
      const response = await insertProgramAreaMapping({ 
        title, 
        year, 
        accredBody, 
        level,
        program, 
        area
      });
      results.push(response); // Collect the response for reporting back to client
    }

    // Notify frontend via WebSocket
    sendUpdate('program-area-update');

    // Send success response back to the client with all inserted results
    res.status(200).json({
      success: true,
      message: 'Program areas added successfully.',
      results
    });

  } catch (error) {
    console.error(error);
    // Catch duplicate entry
    if (error.message === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        duplicateValue: error.duplicateValue,
        message: `${error.duplicateValue} already exist.`
      });
    }

    // Return other server errors
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export default addProgramAreaMapping;