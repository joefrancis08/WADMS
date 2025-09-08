import db from "../../../../config/db.js";
import uuidBase64 from "../../../../utils/shortUUID.js";

const insertArea = async (areaName, levelID, connection = db) => {
  const areaUIID = uuidBase64();
  const query = 'INSERT INTO area (uuid, area_name, level_id) VALUES (?, ?, ?)';
  const [result] = await connection.execute(query, [areaUIID, areaName, levelID]);
  return result;
};

export default insertArea;
