import getDocumentBy from "../../../../models/accreditation/documents/GET/getDocumentBy.js";

const fetchDocumentsBy = async (req, res) => {
  const {
    uploaderId = null,
    accredInfoId = null, 
    levelId = null,
    programId = null,
    areaId = null,
    parameterId = null,
    subParameterId = null,
    indicatorId = null
  } = req.query;

  try {
    let documents;

    // CASE: By Uploader
    if (uploaderId) {
      documents = await getDocumentBy('upload_by', uploaderId);
    } 

    /* 
      You can add more cases here as needed. 
      As of now (2023-10-05) what I need is only by uploader. 
    */

    res.status(200).json({
      success: true,
      documents
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
    throw error;
  }
};

export default fetchDocumentsBy;