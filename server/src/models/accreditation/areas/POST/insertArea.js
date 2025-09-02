import db from "../../../../config/db.js";

const insertArea = async (areaName, connection = db) => {
  const query = 'INSERT INTO area (area_name) VALUES (?)';
  const [result] = await connection.execute(query, [areaName]);
  return result;
};

export default insertArea;
