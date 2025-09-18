import db from "../../../../config/db.js";

/* 
  Insert Level Name into Accreditation Level Table.
  Use connection to include this query in a transaction
  with other query like inserting into program.
*/
export const insertLevel = async (levelName, connection = null) => {
  const query = 'INSERT INTO accreditation_level (level_name) VALUES (?)';

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [levelName]);
    
    return result;

  } catch (error) {
    console.error(error);
  }
};
