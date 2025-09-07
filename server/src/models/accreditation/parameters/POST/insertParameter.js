import db from "../../../../config/db.js";

const insertParameter = async (parameterName, connection = null) => {
  const query = 'INSERT INTO parameter (parameter_name) VALUES (?)';

  try {
    let result;

    if (connection) {
      [result] = await connection.execute(query, [parameterName]);

    } else {
      [result] = await db.execute(query, [parameterName]);
    }

    return result;

  } catch (error) {
    console.error('Error inserting parameter:', error);
    throw error;
  }
};

export default insertParameter;


