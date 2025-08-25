import insertProgramtoAccredit from "../../models/program-to-accredit/POST/insertProgramtoAccredit.js";

// Controller function to add one or multiple programs to accredit
export const addProgramtoAccredit = async (req, res) => {
  try {
    /* 
      Destructure the incoming data from the request body
      Expected format: { levelName: "Level I", programNames: ["BSIT", "BSBA"] }
    */
    const { accreditationPeriod, levelName, programNames } = req.body;

    /* 
      Ensure programNames is always treated as an array
      If it's already an array, use it as is
      If it's a single string, wrap it inside an array
    */
    const programs = Array.isArray(programNames)
      ? programNames
      : [programNames];

    // Validate if program names array is not empty
    if (programs.length === 0) {
      return res.status(400).json({
        message: 'Program names must not be empty',
        success: false
      });
    }

    // Store the results of each insertion
    const results = [];
    for (const programName of programs) {
      // Insert each program into the database with its associated levelName
      const response = await insertProgramtoAccredit(levelName, programName);
      results.push(response); // Collect the response for reporting back to client
    }

    // Send success response back to the client with all inserted results
    res.status(200).json({
      message: 'Program to accredit added successfully.',
      success: true,
      results
    });
    
  } catch (error) {
    // Catch any unexpected errors and log them
    console.error('Error adding program to accredit: ', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
};