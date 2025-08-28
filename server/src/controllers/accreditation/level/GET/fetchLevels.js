import { getLevel } from "../../../../models/accreditation/level/GET/getLevel.js";

const fetchLevels = async (req, res) => {
  try {
    const levels = await getLevel();
    res.status(200).json({
      success: true,
      data: levels
    });

  } catch (error) {
    console.error('Controller has error in fetching accreditation levels:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch accreditation levels.'
    });
  }
};

export default fetchLevels;