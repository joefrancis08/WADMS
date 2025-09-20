import db from "../../../../config/db.js";

const getAreaBy = async (column, value, connection = null) => {
  const allowedColumns = ['id', 'area_name', 'level_id'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `
    SELECT id, area_name 
    FROM area WHERE ${column} = ?
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [value]);

    return result;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getAreaBy;