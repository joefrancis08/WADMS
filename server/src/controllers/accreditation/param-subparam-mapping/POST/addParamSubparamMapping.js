import insertParamSubparamMapping from "../../../../models/accreditation/param-subparam-mapping/POST/insertParamSubparamMapping.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const addParamSubparamMapping = async (req, res) => {
  const { title, year, accredBody, level, program, area, parameter, subParameterNames } = req.body;
  const numYear = Number(year);
  console.log({
    title,
    year,
    accredBody,
    level,
    program,
    area,
    parameter,
    subParameterNames
  });

  try {
    // Validate title, accredBody, level, program, and area
    if (
        !title?.trim() || !accredBody?.trim() || 
        !level?.trim() || !program?.trim() ||
        !area?.trim() || !parameter?.trim()
      ) {
      return res.status(400).json({
        success: false,
        message: 'Title, Accreditation Body, Level, Program, Area, and Parameter are required and must not be empty.'
      });
    }

    // Validate year
    if (!/^\d{4}$/.test(numYear)) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid 4-digit number.'
      });
    }

    // Treat subParameterNames as an array since 2 or more sub-parameters can exist in one parameter
    const subParameters = (Array.isArray(subParameterNames) 
      ? subParameterNames : [subParameterNames])
      .map(sp => sp.trim())
      .filter(sp => sp.length > 0)
    ;

    // Validate if sub-parameters array is not empty
    if (subParameters.length === 0 || !subParameterNames) {
      return res.status(400).json({
        success: false,
        message: 'Sub-parameters must not be empty.'
      });
    }

    // Store the results of each insertion
    const results = [];
    for (const subParameterName of subParameters) {
      // Insert each sub-parameter into the database with its associated period, level, program, area, and parameter
      const response = await insertParamSubparamMapping({ 
        title, 
        year: numYear, 
        accredBody, 
        level, 
        program, 
        area, 
        parameter, 
        subParameter: subParameterName 
      });
      results.push(response); // Collect the response for reporting back to client
    }

    // Notify frontend via WebSocket
    sendUpdate('parameter-subparameter-update');

    // Send success response back to the client with all inserted results
    res.status(200).json({
      success: true,
      message: 'Param-SubParam Mapping added successfully.',
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
      });
    }

    console.error(error);

    // Return other server errors
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error
    });

    throw error;
  }
};

export default addParamSubparamMapping;