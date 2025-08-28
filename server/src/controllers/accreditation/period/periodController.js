import getPeriod from "../../../models/accreditation/program-to-be-accredited/GET/getPeriod.js";

export const fetchPeriod = async (req, res) => {
  try {
    const period = await getPeriod();
    res.status(200).json({
      success: true,
      data: period
    });

  } catch (error) {
    console.error('Controller has error in fetching accreditation period:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch accreditation period.'
    });
  }
};