import insertParamSubparamMapping from "../../../../models/accreditation/param-subparam-mapping/POST/insertParamSubparamMapping.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";
import isValidDateFormat from "../../../../utils/isValidDateFormat.js";

const addParamSubparamMapping = async (req, res) => {
  const { startDate, endDate, levelName, programName, areaName, parameterName, subParameterNames } = req.body;

  console.log(startDate);
  console.log(endDate);
  console.log(levelName);
  console.log(programName);
  console.log(areaName);
  console.log(parameterName);
  console.log(subParameterNames);

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

    // Validate if levelName, programName, areaName, and parameterName is a string
      if (typeof levelName !== 'string' || typeof programName !== 'string' ||
      typeof areaName !== 'string' || typeof parameterName !== 'string') {
        return res.status(400).json({ success: false, message: 'All must be strings.' });
      }

      // Validate if levelName, programName, areaName, and parameterName is not empty
      if (!levelName.trim() || !programName.trim() || !areaName.trim() || !parameterName.trim()) {
        return res.status(400).json({ success: false, message: 'All must not be empty.' });
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
      const response = await insertParamSubparamMapping(startDate, endDate, levelName, programName, areaName, parameterName, subParameterName);
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