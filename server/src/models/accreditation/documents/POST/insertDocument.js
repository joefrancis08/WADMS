import db from "../../../../config/db.js";
import uuidBase64 from "../../../../utils/shortUUID.js";

const insertDocument = async (data = {}) => {
  const documentUUID = uuidBase64();
  const { pamId, apmId, pspmId, simId, uploadedBy, filePath, fileName, uploadedAt } = data;

  const query = `
    INSERT INTO accreditation_document (
      document_uuid, 
      program_area_mapping_id, 
      area_parameter_mapping_id, 
      param_subparam_mapping_id, 
      subparam_indicator_mapping_id, 
      uploaded_by, 
      file_path, 
      file_name, 
      uploaded_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  try {
    const [result] = await db.query(query, [
      documentUUID, 
      pamId, 
      apmId, 
      pspmId, 
      simId, 
      uploadedBy, 
      filePath, 
      fileName
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