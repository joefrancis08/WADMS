import db from "../../../../config/db.js";
import uuidBase64 from "../../../../utils/shortUUID.js";

const insertDocument = async (data = {}, connection = null) => {
  const documentUUID = uuidBase64();
  const { pamId, apmId, pspmId, simId, uploadBy, filePath, fileName } = data;

  const query = `
    INSERT INTO accreditation_document (
      uuid, 
      file_name,
      file_path,
      upload_by,
      upload_at,
      program_area_mapping_id, 
      area_parameter_mapping_id, 
      param_subparam_mapping_id, 
      subparam_indicator_mapping_id 
    )
    VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?)
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.query(query, [
      documentUUID, 
      fileName,
      filePath, 
      uploadBy,
      pamId, 
      apmId, 
      pspmId, 
      simId, 
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