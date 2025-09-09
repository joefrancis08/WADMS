import db from "../../../../config/db.js";

const getSubParameters = async (connection = null) => {
  const query = `
    SELECT sub_parameter_name AS sub_parameter
    FROM sub_parameter
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
    console.error('Error fetching sub-parameters:', error);
    throw error;
  }
};

export default getSubParameters;