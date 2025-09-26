import insertAssignment from "../../../../models/accreditation/assignments/POST/insertAssignment.js";

const addAssignment = async (req, res) => {
  const {
    userId,
    accredInfoId,
    levelId,
    programId,
    areaId,
    parameterId = null,
    subParameterId = null,
    indicatorId = null
  } = req.body;

  if (!userId || !accredInfoId || !levelId || !programId || !areaId) {
    return res.status(400).json({
      message: 'IDs of user, accreditation, level, program, and area are required.',
      success: false
    });
  }

  try {
    const data = await insertAssignment({
      userId,
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId,
      subParameterId,
      indicatorId
    });

    res.status(200).json({
      message: 'Assignment added successfully!.',
      success: true,
      assignmentId: data.insertId
    });

  } catch (error) {
    console.error('Error adding assignment:', error);

    if (error.message === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        message: 'Duplicate entry.',
        success: false,
        isDuplicate: true
      });
    }

    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false
    });
  }
};

export default addAssignment;