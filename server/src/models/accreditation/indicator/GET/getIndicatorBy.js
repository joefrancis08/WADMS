import db from "../../../../config/db.js";

const getIndicatorBy = async (column, value, connection = null) => {
  const allowedColumns = ['id', 'indicator_name', 'subparam_id'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `
    SELECT id, uuid, indicator_name AS indicator
    FROM indicator
    WHERE ${column} = ?
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [value]);

    return result;

  } catch (error) {
    console.error(`Error fetching indicator by ${column}:`, error);
    throw error;
  }
};

export default getIndicatorBy;