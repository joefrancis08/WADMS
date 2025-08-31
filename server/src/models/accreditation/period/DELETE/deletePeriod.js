import db from "../../../../config/db.js";

/* 
  Since deleting period from mapping and from the main table, use options
  instead of separating queries 
*/
const deletePeriod = async (startDate, endDate, options = {}, connection = db) => {
  let query;

  if (options.isDeleteInMap && options.isDeleteInMain) {
    throw new Error('Invalid options: Choose either isDeleteInMap or isDeleteInMain, not both.');
  }
  
  if (options.isDeleteInMap) {
    query = `
      DELETE plm, ap
      FROM program_level_mapping plm
      JOIN accreditation_period ap ON plm.period_id = ap.id
      WHERE ap.start_date = ?
        AND ap.end_date = ?
    `;

  } else if (options.isDeleteInMain) {
    query = `
      DELETE
      FROM accreditation_period 
      WHERE start_date = ?
        AND end_date = ?
    `;
    
  } else {
    throw new Error('Invalid options: No delete type specified.');
  }

  try {
    const [rows] = await connection.execute(query, [startDate, endDate]);
    return rows.affectedRows;
    
  } catch (error) {
    console.error('Error deleting period:', error);
    throw error;
  }
};

export default deletePeriod;