import db from "../../../../config/db.js";
import uuidBase64 from "../../../../utils/shortUUID.js";

const insertIndicator = async (indicator, subparamID, connection = null) => {
  const UUID = uuidBase64();
  const query = `
    INSERT INTO indicator (uuid, indicator_name, subparam_id)
    VALUES (?, ?, ?)
  `;

  try {
    const executor = connection || db;
    const [result] = await executor.execute(query, [UUID, indicator, subparamID]);

    return result;

  } catch (error) {
    console.error('Error inserting indicator: ', error);
    throw error;
  }
};

export default insertIndicator;