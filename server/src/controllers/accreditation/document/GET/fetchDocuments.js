import getAreaDocuments from "../../../../models/accreditation/documents/GET/getAreaDocuments.js";
import getParameterDocuments from "../../../../models/accreditation/documents/GET/getParameterDocuments.js";
import getSubParamDocuments from "../../../../models/accreditation/documents/GET/getSubParamDocuments.js";
import getIndicatorDocuments from "../../../../models/accreditation/documents/GET/getIndicatorDocuments.js";

const fetchDocuments = async (req, res) => {
  const { 
    accredInfoId, 
    levelId, 
    programId, 
    areaId, 
    parameterId = null, 
    subParameterId = null, 
    indicatorId = null 
  } = req.query;

  console.log({
    accredInfoId, 
    levelId, 
    programId, 
    areaId, 
    parameterId, 
    subParameterId, 
    indicatorId
  });

  // Required for all cases
  if (!accredInfoId || !levelId || !programId || !areaId) {
    return res.status(400).json({ success: false, message: "Missing required IDs." });
  }

  try {
    let data;

    // CASE 1: Area only
    if (!parameterId && !subParameterId && !indicatorId) {
      data = await getAreaDocuments({
        accredInfoId,
        levelId,
        programId,
        areaId
      });
    } 
    // CASE 2: Parameter
    else if (parameterId && !subParameterId && !indicatorId) {
      data = await getParameterDocuments({
        accredInfoId,
        levelId,
        programId,
        areaId,
        parameterId
      });
    } 
    // CASE 3: Sub-Parameter
    else if (parameterId && subParameterId && !indicatorId) {
      data = await getSubParamDocuments({
        accredInfoId,
        levelId,
        programId,
        areaId,
        parameterId,
        subParameterId
      });
    } 
    // CASE 4: Indicator
    else if (parameterId && subParameterId && indicatorId) {
      data = await getIndicatorDocuments({
        accredInfoId,
        levelId,
        programId,
        areaId,
        parameterId,
        subParameterId,
        indicatorId
      });
    }

    res.status(200).json({ success: true, data });
    
  } catch (error) {
    console.error("Controller has error in fetching documents:", error);
    res.status(500).json({ success: false, message: "Failed to fetch documents." });
  }
};

export default fetchDocuments;
