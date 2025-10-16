import db from "../../../../config/db.js";

const getSubParameterBy = async (column, value, connection = null) => {
  const allowedColumns = ['id', 'sub_parameter_name', 'parameter_id'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `
    SELECT id, sub_parameter_name
    FROM sub_parameter
    WHERE ${column} = ? 
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [value]);
    return result;
    
  } catch (error) {
    console.error(`Error fetching sub-parameters with the parameter id ${value}`, error);
    throw error;
  }
};

export default getSubParameterBy;