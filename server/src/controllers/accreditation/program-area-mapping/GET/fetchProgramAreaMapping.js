import getProgramAreaMapping from "../../../../models/accreditation/program-area-mapping/GET/getProgramAreaMapping.js";

const fetchProgramAreaMapping = async (req, res) => {
  const { startDate, endDate, levelName, programName } = req.query;
  console.log(startDate);
  console.log(endDate);
  console.log(levelName);
  console.log(programName);
  try {
    const areas = await getProgramAreaMapping(startDate, endDate, levelName, programName);
    res.status(200).json({
      success: true,
      data: areas
    });

  } catch (error) {
    console.error('Controller has error in fetching areas:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch areas'
    });
  }
};

export default fetchProgramAreaMapping;