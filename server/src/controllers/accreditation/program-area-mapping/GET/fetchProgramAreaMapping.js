import getProgramAreaMapping from "../../../../models/accreditation/program-area-mapping/GET/getProgramAreaMapping.js";

const fetchProgramAreaMapping = async (req, res) => {
  const { title, year, accredBody, level, program } = req.query;
  try {
    const areas = await getProgramAreaMapping({
      title,
      year,
      accredBody,
      level,
      program
    });
    console.log(areas);
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