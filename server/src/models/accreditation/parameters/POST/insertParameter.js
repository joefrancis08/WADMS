import db from "../../../../config/db.js";
import uuidBase64 from "../../../../utils/shortUUID.js";

const insertParameter = async (parameterName, areaID, connection = null) => {
  const parameterUUID = uuidBase64();
  const query = 'INSERT INTO parameter (uuid, parameter_name, area_id) VALUES (?, ?, ?)';

  try {
    let result;

    if (connection) {
      [result] = await connection.execute(query, [parameterUUID, parameterName, areaID]);

    } else {
      [result] = await db.execute(query, [parameterUUID, parameterName, areaID]);
    }

    return result;

  } catch (error) {
    console.error('Error inserting parameter:', error);
    throw error;
  }
};

export default insertParameter;


