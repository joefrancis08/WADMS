import db from "../../../../config/db.js";
import getAreaBy from "../../areas/GET/getAreaBy.js";
import insertArea from "../../areas/POST/insertArea.js";
import getLevelBy from "../../level/GET/getLevelBy.js";

const insertProgramAreaMapping = async (startDate, endDate, level, program, area) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Step 1: Check if an area exist, if not insert it.
    const areaResult = await getAreaBy('area_name', area, connection);

    let areaId;
    if (areaResult.length > 0) {
      areaId = areaResult[0].id;
      
    } else {
      const levelResult = await getLevelBy('level_name', level, connection);
      
      if (!levelResult.length) {
        throw new Error('LEVEL_NOT_FOUND');
      }

      const levelID = levelResult[0].id;
      const newArea = await insertArea(area, levelID, connection);
      areaId = newArea.insertId;
    }

    // Step 2: Get the program-level mapping id
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

    // Step 3: Check if program_area_mapping already exists
    const checkQuery = `
      SELECT id FROM program_area_mapping
      WHERE program_level_mapping_id = ?
      AND area_id = ?
    `;

    const [exists] = await connection.execute(checkQuery, [programLevelMappingId, areaId]);
    if (exists.length > 0) {
      const error = new Error('DUPLICATE_ENTRY');
      error.duplicateValue = area; // Attach the area name
      throw error;
    }

    // Step 4: Insert mapping
    const query = `
      INSERT INTO program_area_mapping (program_level_mapping_id, area_id)
      VALUES (?, ?)
    `;

    await connection.execute(query, [programLevelMappingId, areaId]);

    await connection.commit();
    return { programLevelMappingId, areaId };

  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      const duplicateError = new Error('DUPLICATE_ENTRY');
      duplicateError.duplicateValue = area;
      throw duplicateError;
    }

    throw error;

  } finally {
    connection.release();
  }
};

export default insertProgramAreaMapping;