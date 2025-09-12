import db from '../../../../config/db.js';
import getLevelBy from '../../level/GET/getLevelBy.js'
import getProgramBy from '../../../programs/GET/getProgramBy.js';
import { insertLevel } from "../../level/POST/insertLevel.js";
import insertAccreditationInfo from "../../accreditation-info/POST/insertAccreditationInfo.js";
import { insertProgram } from "../../../programs/POST/insertProgram.js";
import getAccredInfoBy from '../../accreditation-info/GET/getAccredInfoBy.js';

const insertInfoLevelProgramMapping = async (title, year, accredBody, program, level) => {
  /* 
    Get a connection from the database pool
    so we can manually control transaction behavior
  */
  const connection = await db.getConnection();

  try {
    /* 
      Start a new transaction,
      all queries inside this block will either succeed together or fail together
    */
    await connection.beginTransaction();

    // Check if program already exist
    const programResult = await getProgramBy('program_name', program, connection);

    /* 
      If program already exist, use the id and insert it in the Program to Accredit Table.
      If program not exist, insert a new program and use the id to insert in Program to Accredit Table 
    */
    let programId;
    if (programResult.length > 0) {
      programId = programResult[0].id;

    } else {
      const newProgram = await insertProgram(program, connection);
      programId = newProgram.insertId;
    }

    // Logic here is the same as program above this code
    const levelResult = await getLevelBy('level_name', level, connection);

    let levelId;
    if (levelResult.length > 0) {
      levelId = levelResult[0].id;

    } else {
      const newLevel = await insertLevel(connection, level);
      levelId = newLevel.insertId;
    }

    // Logic here is the same as program and level
    const accredInfoResult = await getAccredInfoBy('year', year, connection);

    let accredInfoId;
    if (accredInfoResult.length > 0) {
      accredInfoId = accredInfoResult[0].id;

    } else {
      const newAccredInfo = await insertAccreditationInfo(title, year, accredBody, connection);
      accredInfoId = newAccredInfo.insertId;
    }

    // Check if program_level_mapping entry already exist
    const checkQuery = `
      SELECT id
      FROM info_level_program_mapping
      WHERE program_id = ?
        AND level_id = ?
        AND accreditation_info_id = ?
    `;

    const [exists] = await connection.execute(checkQuery, [programId, levelId, accredInfoId]);
    if (exists.length > 0) {
      const error = new Error('DUPLICATE_ENTRY');
      error.duplicateValue = [title, year, accredBody, level, program];
      throw error;
    }

    // Insert programId, levelId, and accredInfoId into Program Level Mapping Table
    const query = `
      INSERT INTO info_level_program_mapping (program_id, level_id, accreditation_info_id) 
      VALUES (?, ?, ?)
    `;
    await connection.execute(query, [programId, levelId, accredInfoId])

    /* 
      If everything is successful, commit the transaction
      which means saving all the changes permanently in the database.
    */
    await connection.commit();
    return { accredInfoId, levelId, programId }; // Return Level, Program, and Period Id (in case of use in the future)

  } catch (error) {
    /* 
      If there’s any error in the transaction block, rollback 
      which means undoes all queries in this transaction 
      to keep database consistent
    */
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      const duplicateError = new Error('DUPLICATE_ENTRY');
      duplicateError.duplicateValue = [title, year, accredBody, level, program];
      throw duplicateError;
    }

    throw error;

  } finally {
    /* 
      Release the connection back to the pool
      so it can be reused by other queries
    */
    connection.release();
  }
};

export default insertInfoLevelProgramMapping;