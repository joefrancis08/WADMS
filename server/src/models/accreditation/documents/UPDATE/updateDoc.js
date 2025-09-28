import db from "../../../../config/db.js";

export const updateDocName = async (newFileName, docId) => {
  const query = `
    UPDATE accreditation_documents
    SET file_name = ?
    WHERE id = ?
  `;

  try {
    const [result] = await db.execute(query, [newFileName, docId]);

    return result;

  } catch (error) {
    console.error(error);
    throw error;
  }
};