import getAssignmentsByUserId from "../../../../models/accreditation/assignments/GET/getAssignmentsByUserId.js";

const fetchAssignmentsByUserId = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      message: 'User Id is required is must be valid',
      success: false,
      errorCode: 'EMPTY_FIELD'
    });
  }

  try {
    const data = await getAssignmentsByUserId(userId);

    res.status(200).json({
      success: true,
      assignmentData: data
    })

  } catch (error) {
    console.error('Error fetching assignments by user id:', error); 
    return res.status(500).json({
      message: 'An unexpected error occurred.',
      success: false,
      errorCode: 'SERVER_ERROR'
    });
  }
};

export default fetchAssignmentsByUserId;