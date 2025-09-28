import db from "../../../../config/db.js";
import uuidBase64 from "../../../../utils/shortUUID.js";

const insertDocument = async (data = {}, connection = null) => {
  const documentUUID = uuidBase64();
  const { 
    fileName, 
    filePath, 
    uploadBy,
    accredInfoId,
    levelId,
    programId,
    areaId,
    parameterId,
    subParameterId,
    indicatorId,
  } = data;

  const query = `
    INSERT INTO accreditation_documents (
      uuid, 
      file_name,
      file_path,
      upload_by,
      upload_at,
      accred_info_id,
      level_id,
      program_id,
      area_id,
      parameter_id,
      subparameter_id,
      indicator_id
    )
    VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.query(query, [
      documentUUID, 
      fileName,
      filePath, 
      uploadBy,
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId,
      subParameterId,
      indicatorId
    ]);

    return {
      documentUUID,
      affectedRows: result.affectedRows
    };

  } catch (error) {
    console.error('Error inserting document:', error);
    throw new Error('Database error while inserting document');
  }
};

export default insertDocument;