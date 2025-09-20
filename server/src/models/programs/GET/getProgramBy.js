import db from "../../../config/db.js";

const getProgramBy = async (column, value, connection = null) => {
  const allowedColumns = ['id', 'program_name'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `SELECT id, program_name FROM program WHERE ${column} = ?`;

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query, [value]);

    return rows;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getProgramBy;