import db from "../../../../config/db.js";

const getParameterBy = async (column, value, connection = null) => {
  const allowedColumns = ['id', 'parameter_name', 'area_id'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `SELECT id, parameter_name FROM parameter WHERE ${column} = ?`;
  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [value]);

    return result;
    
  } catch (error) {
    console.error(`Error getting parameters by ${column}`, error);
    throw error;
  }
};

export default getParameterBy;