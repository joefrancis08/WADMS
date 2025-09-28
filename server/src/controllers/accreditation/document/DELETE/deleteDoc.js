import deleteDocument from "../../../../models/accreditation/documents/DELETE/deleteDoc.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const deleteDoc = async (req, res) => {
  const { docId } = req.query;

  try {
    const result = await deleteDocument(docId);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No matching record to delete for document id ${docId}`,
        success: false,
      });
    }

    sendUpdate('document-update');

    res.status(200).json({
      message: `Deleted successfully!`,
      success: true,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occured while deleting the record.',
      success: false,
    });
  }
};



export default deleteDoc;