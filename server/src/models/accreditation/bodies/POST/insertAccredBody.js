import db from "../../../../config/db.js";

/* 
  Insert Accreditation Body into Program Table.
  Use connection to include this query in a transaction.
*/
const insertAccredBody = async (accredBodyName, accredBodyDescr = null, connection = null) => {
  const query = `
    INSERT INTO accreditation_body (name, description)
    VALUES (?, ?); 
  `;

  try {
    // Insert name and description (if not null) of accreditation body
    let result;

    if (connection) {
      [result] = await connection.execute(query, [accredBodyName, accredBodyDescr]);

    } else {
      [result] = await db.execute(query, [accredBodyName, accredBodyDescr]);
    }

    return result;

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const duplicateError = new Error('DUPLICATE_ENTRY');
      duplicateError.duplicateValue = accredBodyName;
      throw duplicateError;
    }

    throw error;
  } 
};

export default insertAccredBody;