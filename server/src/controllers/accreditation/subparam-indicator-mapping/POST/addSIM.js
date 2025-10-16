import insertSIM from "../../../../models/accreditation/subparam-indicator-mapping/POST/insertSIM.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const addSIM = async (req, res) => {
  const { title, year, accredBody, level, program, area, parameter, subParameter, indicatorNames } = req.body;

  try {
    // Validate title, accredBody, level, program, area, parameter, and subparameter
    if (
        !title?.trim() || !accredBody?.trim() || 
        !level?.trim() || !program?.trim() ||
        !area?.trim() || !parameter?.trim() ||
        !subParameter?.trim()
      ) {
      return res.status(400).json({
        success: false,
        message: 'Title, Accreditation Body, Level, Program, Area, Parameter, and Sub-parameter are required and must not be empty.'
      });
    }

    // Validate year
    if (!/^\d{4}$/.test(year)) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid 4-digit number.'
      });
    }

    // Treat indicatorNames as an array since 2 or more indicators can exist in one sub-parameter
    const indicators = (Array.isArray(indicatorNames)
      ? indicatorNames : [indicatorNames])
      .map(i => i.trim())
      .filter(i => i.length > 0)
    ;

    // Validate if indicators array is not empty
    if (indicators.length === 0 || !indicatorNames) {
      return res.status(400).json({
        success: false,
        message: 'Indicators must not be empty.'
      });
    }

    // Store the results of each insertion
    const results = [];
    for (const indicator of indicators) {
      // Insert each sub-parameter into the db with its associated accreditation title, year, body, level, program, area, parameter, and sub-parameter
      const response = await insertSIM({
        title,
        year,
        accredBody,
        level,
        program,
        area,
        parameter, 
        subParameter,
        indicator
      });
      results.push(response);
    }

    // Notify the frontend via WebSocket
    sendUpdate('subparam-indicator-update');

    // Send success response back to the client with all inserted results
    res.status(200).json({
      success: true,
      message: 'Indicator added successfully.',
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
      message: 'An unexpected error occur',
      error
    });

    throw error;
  }
};

export default addSIM;