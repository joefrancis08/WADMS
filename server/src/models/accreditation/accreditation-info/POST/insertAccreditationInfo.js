import db from "../../../../config/db.js";
import uuidBase64 from "../../../../utils/shortUUID.js";
import getAccredBodyBy from "../../bodies/GET/getAccredBodyBy.js";
import insertAccredBody from "../../bodies/POST/insertAccredBody.js";

/* 
  Insert title, year, accreditation body id into Accreditation Info Table.
*/
const insertAccreditationInfo = async (title, year, accredBody) => {
  const accredUUID = uuidBase64();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Check if accreditation body already exist
    const accredBodyResult = await getAccredBodyBy('name', accredBody, connection);

    /* 
      If accreditation body exist, use the id and insert it in the Accreditation Info Table.
      If not, insert a new accreditation body and use the id to insert in Accreditation Info Table
    */
    let accredBodyId;
    if (accredBodyResult.length > 0) {
      accredBodyId = accredBodyResult[0]?.id;

    } else {
      const newAccredBody = await insertAccredBody(accredBody, null, connection);
      accredBodyId = newAccredBody?.insertId;
    }

    const query = 'INSERT INTO accreditation_info (uuid, title, year, accreditation_body_id) VALUES (?, ?, ?, ?)';

    // Check if accreditation data already exists
    const checkQuery = `
      SELECT id FROM accreditation_info
      WHERE title = ?
        AND year = ?
        AND accreditation_body_id = ?
    `;

    const [exists] = await connection.execute(checkQuery, [title, year, accredBodyId]);
    if (exists.length > 0) {
      const error = new Error('DUPLICATE_ENTRY');
      error.duplicateValue = [title, year, accredBody]; // Attach the title, year, and accreditation body
      throw error;
    }

    const [result] = await connection.execute(query, [accredUUID, title, year, accredBodyId]);

    await connection.commit();

    return { id: result.insertId, UUID: accredUUID};

  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      const duplicateError = new Error('DUPLICATE_ENTRY');
      duplicateError.duplicateValue = [title, year, accredBody];
      throw duplicateError;
    }

    console.error(error)

    throw error;

  } finally {
    connection.release();
  }
};

export default insertAccreditationInfo;