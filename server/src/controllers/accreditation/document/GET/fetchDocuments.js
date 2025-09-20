import getAreaDocument from "../../../../models/accreditation/documents/GET/getAreaDocument.js";
import getIndicatorDocument from "../../../../models/accreditation/documents/GET/getIndicatorDocument.js";
import getParameterDocument from "../../../../models/accreditation/documents/GET/getParameterDocument.js";
import getSubParamDocument from "../../../../models/accreditation/documents/GET/getSubParamDocument.js";

const fetchDocuments = async (req, res) => {
  const { title, year, accredBody, level, program, area, parameter = null, subParameter = null, indicator = null } = req.query;

  if (!title || !year || !accredBody || !level || !program || !area) {
    return res.status(400).json({
      success: false,
      message: 'Missing required query parameters.'
    });
  }

  try {
    let data;
    if (!parameter && !subParameter && !indicator) {
      // Fetch documents by Area only
      const documents = await getAreaDocument({
        title,
        year,
        accredBody,
        level,
        program,
        area
      });
      data = documents;

    } else if (parameter && !subParameter && !indicator) {
      // Fetch documents by Parameter
      const documents = await getParameterDocument({
        title,
        year,
        accredBody,
        level,
        program,
        area,
        parameter
      });
      data = documents;

    } else if (parameter && subParameter && !indicator) {
      // Fetch documents by Sub-Parameter
      const documents = await getSubParamDocument({
        title,
        year,
        accredBody,
        level,
        program,
        area,
        parameter,
        subParameter
      });
      data = documents;
    
    } else if (parameter && subParameter && indicator) {
      // Fetch documents by Indicator
      const documents = await getIndicatorDocument({
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

      data = documents;
    }

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Controller has error in fetching documents:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch documents.'
    });
  }
};


export default fetchDocuments;