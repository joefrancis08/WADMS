import db from "../../../config/db.js";

const insertPeriod = async (startDate, endDate, connection = db) => {
  const query = 'INSERT INTO accreditation_period (start_date, end_date, level_id) VALUES (?, ?)';
  const [result] = await connection.execute(query, [startDate, endDate]);
  return result;
};

export default insertPeriod;