import { insertProgram } from "../../models/program/POST/insertProgram.js";

// Get the request body from frontend and try to insert in program table
export const addProgram = async (req, res) => {
  try {
    const { programName } = req.body;
    const response = await insertProgram(programName);

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