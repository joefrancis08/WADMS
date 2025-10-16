import db from "../../../../config/db.js";

const getParameterBy = async (column, value, connection = null) => {
  const allowedColumns = ['id', 'parameter_name'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `SELECT id, parameter_name FROM parameter WHERE ${column} = ?`;
  try {
    let result;

    if (connection) {
      [result] = await connection.execute(query, [value]);

    } else {
      [result] = await db.execute(query, [value]);
    }
    
    return result;

  } catch (error) {
    console.error('Error fetching parameters:', error);
    throw error;
  }
};

export default getParameterBy;