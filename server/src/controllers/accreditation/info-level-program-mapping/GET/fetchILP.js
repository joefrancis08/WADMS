import getILP from "../../../../models/accreditation/info-level-program-mapping/GET/getILP.js";
import getProgram from "../../../../models/programs/GET/getProgram.js";
import getAccredInfo from "../../../../models/accreditation/accreditation-info/GET/getAccredInfo.js";

const fetchILP = async (req, res) => {
  try {
    const accredInfo = await getAccredInfo();
    const programs = await getProgram();
    const infoLevelPrograms = await getILP();

    res.status(200).json({
      success: true,
      data: infoLevelPrograms.map(item => {
        const program = programs.find(p => p.program_uuid === item.program_uuid);
        const accredInfoItem = accredInfo.find(i => i.accred_uuid === item.accred_uuid);

        return {
          ...item,
          program: program || null,
          accreditationInfo: accredInfoItem || null
        };
      })
    });

  } catch (error) {
    console.error('Controller has error in accreditation info, level, and programs: ', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accreditation info, level, and programs.'
    });
  }
};

export default fetchILP;