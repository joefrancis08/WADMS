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

  const filePath = req.file?.path;
  const fileName = req.file?.filename;
  const savedFilePath = req.savedFilePath || filePath;
  const savedFileName = req.savedFileName;

  // Validate required fields
  if (!accredInfoId || !levelId || !programId || !areaId || !fileName || !savedFilePath) {
    return res.status(400).json({ 
      message: 'Missing required fields', 
      success: false 
    });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Pass ID values
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
      throw new Error('Failed to insert document.');
    }

    await connection.commit();

    // Notify via WebSocket
    sendUpdate('document-update');

    return res.status(201).json({
      message: `${savedFileName} uploaded successfully!`,
      success: true,
      fileName: savedFileName,
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error adding document:', error);
    return res.status(500).json({
      message: error.message || 'An unexpected error occurred',
      success: false,
    });
  } finally {
    connection.release();
  }
};

export default addDocument;
