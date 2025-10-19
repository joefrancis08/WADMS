import deleteAssignmentModel from "../../../../models/accreditation/assignments/DELETE/deleteAssignment.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const deleteAssignment = async (req, res) => {
  const {
    taskForceId,
    ilpmId,
    pamId,
    apmId = null,
    pspmId = null,
    simId = null
  } = req.query;

  console.log({ 
    taskForceId,
    ilpmId,
    pamId,
    apmId,
    pspmId,
    simId
  });

  try {
    const result = await deleteAssignmentModel(
      {
        ilpmId,
        pamId,
        apmId,
        pspmId,
        simId,
      }, 
      {
        taskForceId
      },
      {
        forDeanTaskForceDetailPage: !!taskForceId, // Only true if taskForceId exists
        forDeanAssignmentPage: !! (ilpmId && pamId) // Only true if these two are given
      }
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'No data to delete.',
        success: false
      })
    }

    sendUpdate('assignment-update');

    return res.status(200).json({
      message:'Assigment deleted successfully!',
      success: true,
      deleteCount: result.affectedRows
    });

  } catch (error) {
    console.error('Error deleting assignment:', error);

    return res.status(500).json({
      message: 'An unexpected error occured.',
      success: false
    })
  }
};

export default deleteAssignment;