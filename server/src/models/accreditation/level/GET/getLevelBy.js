import db from "../../../../config/db.js";

const getLevelBy = async (column, value, connection = null) => {
  const allowedColumns = ['id', 'level_name'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `SELECT id, level_name FROM accreditation_level WHERE ${column} = ?`;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [value]);

    return result;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getLevelBy;