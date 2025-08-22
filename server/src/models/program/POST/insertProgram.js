import db from "../../../config/db.js";

export const insertProgram = async (programName) => {
  // Insert Program Name into program table
  const query = 'INSERT INTO program (program_name) VALUES (?)';
  const [result] = await db.execute(query, [programName]);
  return result;
};
