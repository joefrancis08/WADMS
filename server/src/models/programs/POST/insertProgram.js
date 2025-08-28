import db from "../../../config/db.js";

/* 
  Insert Program into Program Table.
  Use connection to include this query in a transaction
  with other query like inserting into level.
*/
export const insertProgram = async (connection = db, programName) => {
  const query = 'INSERT INTO program (program_name) VALUES (?)';
  const [result] = await connection.execute(query, [programName]);
  return result;
};
