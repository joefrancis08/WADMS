import db from "../../../../config/db.js";

const deleteDoc = async (docId, connection = null) => {
  const query =  `
    DELETE FROM accreditation_documents
    WHERE id = ?
  `;

  try {
    const executor = connection || db
    const [rows] = await executor.execute(query, [docId]);
    return rows.affectedRows;

  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

export default deleteDoc;