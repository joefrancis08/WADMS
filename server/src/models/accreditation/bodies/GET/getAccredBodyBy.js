import db from "../../../../config/db.js";

const getAccredBodyBy = async (column, value, connection = null) => {
  const allowedColumns = ['id', 'name'];

  if (!allowedColumns.includes(column)) {
    throw new Error('Invalid column.');
  }

  const query = `
    SELECT id, name
    FROM accreditation_body
    WHERE ${column} = ?
  `;

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query, [value]);

    return rows;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getAccredBodyBy;