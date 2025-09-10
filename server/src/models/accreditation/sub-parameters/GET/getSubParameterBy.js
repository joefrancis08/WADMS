import db from "../../../../config/db.js";

const getSubParameterBy = async (column, value, connection = null) => {
  const allowedColumns = ['id', 'sub_parameter_name'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `
    SELECT id, sub_parameter_name
    FROM sub_parameter
    WHERE ${column} = ? 
  `;

  try {
    let result;

    if (connection) {
      [result] = await connection.execute(query, [value]);

    } else {
      [result] = await db.execute(query, [value]);
    }

    return result;

  } catch (error) {
    console.error('Error fetching sub-parameters:', error);
    throw error;
  }
};

export default getSubParameterBy;