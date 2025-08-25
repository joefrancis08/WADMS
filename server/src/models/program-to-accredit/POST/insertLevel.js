import db from "../../../config/db.js";

/* 
  Insert Level Name into Accreditation Level Table.
  Use connection to include this query in a transaction
  with other query like inserting into program.
*/
export const insertLevel = async (connection = db, levelName) => {
  const query = 'INSERT INTO accreditation_level (level_name) VALUES (?)';
  const [result] = await connection.execute(query, [levelName]);
  return result;
};
