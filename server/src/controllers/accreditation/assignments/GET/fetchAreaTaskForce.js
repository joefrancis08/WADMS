import getAreaTaskForce from "../../../../models/accreditation/assignments/GET/getAreaTaskForce.js";

const fetchAreaTaskForce = async (req, res) => {
  const { accredInfoId, levelId, programId, areaId } = req.query;

  try {
    const data = await getAreaTaskForce({
      accredInfoId, 
      levelId, 
      programId, 
      areaId 
    });

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error fetching task force members:', error);

    return res.status(500).json({
      message: 'An unexpected error occured.',
      success: false
    });
  }
};

export default fetchAreaTaskForce;