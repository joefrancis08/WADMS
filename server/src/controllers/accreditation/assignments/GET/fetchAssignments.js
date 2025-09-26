import getAssignments from '../../../../models/accreditation/assignments/GET/getAssignments.js';

const fetchAssignments = async (req, res) => {
  const accredInfoId = Number(req.query.accredInfoId);
  const levelId = Number(req.query.levelId);
  const programId = Number(req.query.programId);
  const areaId = Number(req.query.areaId);
  const parameterId = req.query.parameterId ? Number(req.query.parameterId) : null;
  const subParameterId = req.query.subParameterId ? Number(req.query.subParameterId) : null;
  const indicatorId = req.query.indicatorId ? Number(req.query.indicatorId) : null;

  if (!accredInfoId || !levelId || !programId || !areaId) {
    return res.status(400).json({
      message: 'accredInfoId, levelId, programId, and areaId are required.',
      success: false
    });
  }

  console.table({
    accredInfoId,
    levelId,
    programId,
    areaId,
    parameterId,
    subParameterId,
    indicatorId
  });
  try {
    const data = await getAssignments({
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId,
      subParameterId,
      indicatorId
    });

    return res.status(200).json({
      success: true,
      assignmentData: data
    });

  } catch (error) {
    console.error('Error fetching assignments data:', error);

    return res.status(500).json({
      message: 'An unexpected error occurred.',
      success: false
    });
  }
};

export default fetchAssignments;
