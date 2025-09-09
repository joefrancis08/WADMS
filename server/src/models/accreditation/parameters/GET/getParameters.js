import db from "../../../../config/db.js";

const getParameters = async (connection = null) => {
  const query = `
    SELECT parameter_name AS parameter
    FROM parameter
  `;

  try {
    let result;

    if (connection) {
      [result] = await connection.execute(query);

    } else {
      [result] = await db.execute(query);
    }

    return result;

  } catch (error) {
    console.error('Error fetching parameters;', error);
    throw error;
  }
};

export default getParameters;