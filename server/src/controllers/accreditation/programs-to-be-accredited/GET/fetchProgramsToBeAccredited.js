import getPeriod from "../../../../models/accreditation/period/GET/getPeriod.js";
import getILP from "../../../../models/accreditation/info-level-program-mapping/GET/getILP.js";
import getProgram from "../../../../models/programs/GET/getProgram.js";

const fetchProgramsToBeAccredited = async (req, res) => {
  try {
    const period = await getPeriod();
    const programs = await getProgram();
    const programsToBeAccredited = await getILP();

    res.status(200).json({
      success: true,
      data: programsToBeAccredited.map(item => {
        const program = programs.find(p => p.program_uuid === item.program_uuid);
        const periodItem = period.find(pr => pr.period_uuid === item.period_uuid);

        return {
          ...item,
          program: program || null,
          period: periodItem || null
        };
      })
    });

  } catch (error) {
    console.error('Controller has error in fetching program: ', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programs to be accredited.'
    });
  }
};

export default fetchProgramsToBeAccredited;