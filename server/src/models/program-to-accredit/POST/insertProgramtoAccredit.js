import db from "../../../config/db.js";
import getLevelBy from "../GET/getLevelBy.js";
import getProgramBy from "../GET/getProgramBy.js";
import { insertLevel } from "./insertLevel.js";
import { insertProgram } from "./insertProgram.js";

const insertProgramtoAccredit = async (period, level, program) => {
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
      const newProgram = await insertProgram(connection, program);
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

    // Insert program and level Id into Program Level Mapping Table
    const query = 'INSERT INTO program_level_mapping (program_id, level_id) VALUES (?, ?)';
    await connection.execute(query, [programId, levelId])

    /* 
      If everything is successful, commit the transaction
      which means saving all the changes permanently in the database.
    */
    await connection.commit();
    return { levelId, programId }; // Return Level and Program Id (in case of use in the future)

  } catch (error) {
    /* 
      If there’s any error in the transaction block, rollback 
      which means undoes all queries in this transaction 
      to keep database consistent
    */
    await connection.rollback();
    console.error(error);
    throw error;

  } finally {
    /* 
      Release the connection back to the pool
      so it can be reused by other queries
    */
    connection.release();
  }
};

export default insertProgramtoAccredit;