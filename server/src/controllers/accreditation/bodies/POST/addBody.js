import insertAccredBody from "../../../../models/accreditation/bodies/POST/insertAccredBody.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

const addBody = async (req, res) => {
  const { accredBody } = req.body;

  try {
    if (
      !accredBody ||                      
      typeof accredBody !== 'string' ||   
      accredBody.trim() === '' ||         
      !isNaN(Number(accredBody.trim()))   
    ) {
      return res.status(400).json({
        message: 'accredBody must be a non-empty text name, not a number.'
      });
    }

    const response = await insertAccredBody(accredBody);

    console.log(response);

    sendUpdate('accred-body-update');

    res.status(200).json({
      message: 'Accreditation body added successfully.',
      success: true,
      response
    });

  } catch (error) {
    if (error.message === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        message: `${error.duplicateValue} already exists!`,
        success: false,
        duplicateValue: error.duplicateValue
      });
    }
    
    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false,
    });
  }
};

export default addBody;