import { insertLevel } from "../../../../models/accreditation/level/POST/insertLevel.js";

const addLevel = async (req, res) => {
  try {
    const { levelName } = req.body;
    const response = await insertLevel(db, levelName);
    // console.log(response);
    // console.log(response.id);

    res.status(200).json({
      message: 'Accreditation level was added successfully.',
      success: true,
      response
    });

    sendUpdate('accreditation-levels-update');

  } catch (error) {
    console.error('Error adding level: ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
};

export default addLevel;