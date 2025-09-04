import db from "../../../../config/db.js";
import getAreaBy from "../../areas/GET/getAreaBy.js";
import insertArea from "../../areas/POST/insertArea.js";

const insertProgramAreaMapping = async (startDate, endDate, level, program, area) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Step 1: Check if an exist, if not insert it.
    const areaResult = await getAreaBy('area_name', area, connection);

    let areaId;
    if (areaResult.length > 0) {
      areaId = areaResult[0].id;
      
    } else {
      const newArea = await insertArea(area, connection);
      areaId = newArea.insertId;
    }

    // Step : Get the program-level mapping id
    const programLevelMappingQuery = `
      SELECT plm.id
      FROM program_level_mapping plm
      JOIN accreditation_period ap
        ON plm.period_id = ap.id
      JOIN accreditation_level al
        ON plm.level_id = al.id
      JOIN program p
        ON plm.program_id = p.id
      WHERE ap.start_date = ?
        AND ap.end_date = ?
        AND al.level_name = ?
        AND p.program_name = ?
    `;
    const [rows] = await connection.execute(programLevelMappingQuery, [
      startDate,
      endDate,
      level,
      program
    ]);

    if (rows.length === 0) {
      throw new Error("PROGRAM_LEVEL_MAPPING_NOT_FOUND");
    }

    const programLevelMappingId = rows[0].id;

    // Step 3: Insert mapping
    const query = `
      INSERT INTO program_area_mapping (program_level_mapping_id, area_id)
      VALUES (?, ?)
    `;

    await connection.execute(query, [programLevelMappingId, areaId]);

    await connection.commit();
    return {programLevelMappingId, areaId};

  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('DUPLICATE_ENTRY');
    }

    throw error;

  } finally {
    connection.release();
  }
};

export default insertProgramAreaMapping;