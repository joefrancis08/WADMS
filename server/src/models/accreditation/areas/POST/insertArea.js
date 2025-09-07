import db from "../../../../config/db.js";
import uuidBase64 from "../../../../utils/shortUUID.js";

const insertArea = async (areaName, connection = db) => {
  const areaUIID = uuidBase64();
  const query = 'INSERT INTO area (uuid, area_name) VALUES (?, ?)';
  const [result] = await connection.execute(query, [areaUIID, String(areaName).toUpperCase()]);
  return result;
};

export default insertArea;
