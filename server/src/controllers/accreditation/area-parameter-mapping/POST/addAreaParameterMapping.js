import insertAreaParameterMapping from "../../../../models/accreditation/area-parameter-mapping/POST/insertAreaParameterMapping.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const addAreaParameterMapping = async (req, res) => {
  const { title, year, accredBody, level, program, area, parameterNames } = req.body;
  
  try {
    // Validate title, accredBody, level, program, and area
    if (
        !title?.trim() || !accredBody?.trim() || 
        !level?.trim() || !program?.trim() ||
        !area?.trim()
      ) {
      return res.status(400).json({
        success: false,
        message: 'Title, Accreditation Body, Level, Program, and Area are required and must not be empty.'
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
      Ensure parameterNames are always treated as an array
      If it's already an array, use it as is
      If it's a single string, wrap it inside an array
    */
    const parameters = (Array.isArray(parameterNames) ? parameterNames : [parameterNames])
      .map(a => a.trim())
      .filter(a => a.length > 0);

    // Validate if parameters array is not empty
    if (parameters.length === 0 || !parameterNames) {
      return res.status(400).json({
        success: false,
        message: 'Parameter names must not be empty.'
      });
    }

    // Store the results of each insertion
    const results = [];
    for (const parameterName of parameters) {
      // Insert each parameter into the database with its associated period, level, program, and area
      const response = await insertAreaParameterMapping({
        title,
        year,
        accredBody,
        level,
        program,
        area,
        parameter: parameterName
      });
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
    console.error('addAreaParameterMapping error:', error);
    // MySQL duplicate entry -> respond 409 + include duplicateValue (if parsable)
    if (error?.code === 'ER_DUP_ENTRY' || error?.errno === 1062) {
      // try to extract duplicate value from sqlMessage: "Duplicate entry 'VALUE' for key '...'"
      const msg = error?.sqlMessage ?? error?.message ?? '';
      const m = msg.match(/Duplicate entry '(.+?)'/);
      const duplicateValue = m ? m[1] : null;
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        duplicateValue,
        message: duplicateValue ? `${duplicateValue} already exist.` : 'Duplicate entry.'
      });
    }

    // Other errors -> 500
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: (error && error.message) ? error.message : error,
    });
   }
};

export default addAreaParameterMapping;