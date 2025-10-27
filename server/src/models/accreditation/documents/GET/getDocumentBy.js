import db from "../../../../config/db.js";

const getDocumentBy = async(column, value, connection = null) => {
  const allowedColumns = ['id', 'uuid', 'upload_by', 'upload_at', 'file_name', 'accred_info_id', 'level_id', 'program_id', 'area_id', 'parameter_id', 'subparameter_id', 'indicator_id'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `
    SELECT 
      id AS docID,
      uuid AS docUUID,
      file_name AS docFileName,
      file_path AS docFilePath,
      upload_by AS uploadedBy,
      upload_at AS uploadAt,
      accred_info_id AS accredInfoID,
      level_id AS levelID,
      program_id AS programID,  
      area_id AS areaID,
      parameter_id AS parameterID,
      subparameter_id AS subParameterID,
      indicator_id AS indicatorID
    FROM accreditation_documents
    WHERE ${column} = ?
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [value]);

    return result;

  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

export default getDocumentBy;