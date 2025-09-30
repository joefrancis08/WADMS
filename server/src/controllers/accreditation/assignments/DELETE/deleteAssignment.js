import deleteAssignmentModel from "../../../../models/accreditation/assignments/DELETE/deleteAssignment.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const deleteAssignment = async (req, res) => {
  const accredInfoId = Number(req.query.accredInfoId);
  const levelId = Number(req.query.levelId);
  const programId = Number(req.query.programId);
  const areaId = Number(req.query.areaId);
  const parameterId = req.query.parameterId ? Number(req.query.parameterId) : null;
  const subParameterId = req.query.subParameterId ? Number(req.query.subParameterId) : null;
  const indicatorId = req.query.indicatorId ? Number(req.query.indicatorId) : null;

  const userId = Number(req.query.userId);

  try {
    const result = await deleteAssignmentModel(
      {
        accredInfoId,
        levelId,
        programId,
        areaId,
        parameterId,
        subParameterId,
        indicatorId
      }, 
      {
        userId
      },
      {
        forDeanTaskForceDetailPage: !!userId, // Only true if userId exists
        forDeanAssignmentPage: !! (accredInfoId && levelId && programId && areaId) // Only true if these are given
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