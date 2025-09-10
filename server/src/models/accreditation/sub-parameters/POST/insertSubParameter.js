import db from "../../../../config/db.js";
import uuidBase64 from "../../../../utils/shortUUID.js";

const insertSubParameter = async (subParameterName, parameterID, connection = null) => {
  const subParamUUID = uuidBase64();
  const query = `
    INSERT INTO sub_parameter (uuid, sub_parameter_name, parameter_id)
    VALUES (?, ?, ?)
  `;

  try {
    let result;

    if (connection) {
      [result] = await connection.execute(query, [subParamUUID, subParameterName, parameterID]);

    } else {
      [result] = await db.execute(query, [subParamUUID, subParameterName, parameterID]);
    }

    return result;

  } catch (error) {
    console.error('Error inserting sub-parameter:', error);
    throw error;
  }
};

export default insertSubParameter;