import db from "../../../config/db.js";
import { insertProgram } from "../../../models/programs/POST/insertProgram.js";

// Get the request body from frontend and try to insert in program table
const addProgram = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { programName } = req.body;
    const response = await insertProgram(connection, programName);
    console.log(response);

    res.status(200).json({
      message: 'Program added successfully',
      success: true,
      response
    });

  } catch (error) {
    console.error('Error adding program: ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
};

export default addProgram;