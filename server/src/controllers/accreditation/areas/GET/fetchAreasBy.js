import getAreasBy from "../../../../models/accreditation/areas/GET/getAreaBy.js";
import getLevelBy from "../../../../models/accreditation/level/GET/getLevelBy.js";

const fetchAreasBy = async (req, res) => {

  const { level } = req.query;

  console.log(level);
  const levelResult = await getLevelBy('level_name', level);

  let levelId;
  if (levelResult.length > 0) {
    levelId = levelResult[0].id;
  }

  try {
    const areas = await getAreasBy('level_id', levelId);

    if (areas.length === 0) {
      return res.status(404).json({
        message: 'No areas found.',
        success: false
      });
    }

    res.status(200).json({
      success: true,
      areas
    });

  } catch (error) {
    console.error('Controller has error fetching areas by level id:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch areas by level id.'
    })
  }
};

export default fetchAreasBy;