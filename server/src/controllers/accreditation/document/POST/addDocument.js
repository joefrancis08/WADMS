import db from "../../../../config/db.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";
import insertDocument from "../../../../models/accreditation/documents/POST/insertDocument.js";

const addDocument = async (req, res) => {
  const { 
    accredInfoId,
    levelId,
    programId,
    areaId,
    parameterId = null,
    subParameterId = null,
    indicatorId = null,
    uploadBy = null,
  } = req.body;

  // Handle both single or multiple files
  const files = req.files?.length ? req.files : req.file ? [req.file] : [];
  console.log('Files:', req.files);

  if (files.length === 0) {
    return res.status(400).json({ 
      message: 'No files uploaded', 
      success: false 
    });
  }

  // Validate required fields (besides file)
  if (!accredInfoId || !levelId || !programId || !areaId) {
    return res.status(400).json({ 
      message: 'Missing required fields', 
      success: false 
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const results = [];

    for (const file of files) {
      const filePath = file.path || file.secure_url;
      const fileName = file.filename || file.originalname;
      const savedFilePath = req.savedFilePath || filePath;
      const savedFileName = req.savedFileName || fileName;

      // Insert each file
      const insertResult = await insertDocument(
        {
          fileName: savedFileName,
          filePath: savedFilePath,
          uploadBy,
          accredInfoId,
          levelId,
          programId,
          areaId,
          parameterId,
          subParameterId,
          indicatorId,
        },
        connection
      );

      if (insertResult.affectedRows === 0) {
        throw new Error(`Failed to insert document: ${savedFileName}`);
      }

      results.push(savedFileName);
    }

    await connection.commit();

    // Notify via WebSocket
    sendUpdate('document-update');

    return res.status(201).json({
      message: `${results.length} file(s) uploaded successfully!`,
      success: true,
      files: results,
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error adding documents:', error);
    return res.status(500).json({
      message: error.message || 'An unexpected error occurred',
      success: false,
    });
  } finally {
    connection.release();
  }
};

export default addDocument;
