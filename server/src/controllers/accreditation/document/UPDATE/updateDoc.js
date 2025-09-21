import { updateDocName } from "../../../../models/accreditation/documents/UPDATE/updateDoc.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

export const updateDocumentName = async (req, res) => {
  const { docId } = req.params;
  const { newFileName } = req.body;

  try {
    const response = await updateDocName(newFileName, docId);

    if (response.affectedRows === 0) {
      return res.status(404).json({
        message: 'Document not found.',
        success: false
      });
    }

    sendUpdate('document-update');

    res.status(200).json({
      message: 'Document updated successfully!',
      success: true
    });

  } catch (error) {
    console.error('Error updating document name:', error);
    res.status(500).json({
      message: 'An unexpected error occurred.',
      success: false
    });
  }
};