import db from "../../../../config/db.js";
import getAreaBy from "../../areas/GET/getAreaBy.js";
import insertArea from "../../areas/POST/insertArea.js";
import getLevelBy from "../../level/GET/getLevelBy.js";

const insertProgramAreaMapping = async ({ title, year, accredBody, level, program, area }) => {
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

    // Step 2: Get the info_level_program_mapping id
    const programLevelMappingQuery = `
      SELECT ilpm.id
      FROM info_level_program_mapping ilpm
      JOIN accreditation_info ai
        ON ilpm.accreditation_info_id = ai.id
      JOIN accreditation_body ab
        ON ai.accreditation_body_id = ab.id
      JOIN accreditation_level al
        ON ilpm.level_id = al.id
      JOIN program p
        ON ilpm.program_id = p.id
      WHERE ai.title = ?
        AND ai.year = ?
        AND ab.name = ?
        AND al.level_name = ?
        AND p.program_name = ?
    `;

    const [rows] = await connection.execute(programLevelMappingQuery, [
      title,
      year,
      accredBody,
      level,
      program
    ]);

    if (rows.length === 0) {
      throw new Error("INFO_LEVEL_PROGRAM_MAPPING_NOT_FOUND");
    }

    const infoLevelProgramMappingId = rows[0].id;

    // Step 3: Insert mapping
    const query = `
      INSERT INTO program_area_mapping (info_level_program_mapping_id, area_id)
      VALUES (?, ?)
    `;

    await connection.execute(query, [infoLevelProgramMappingId, areaId]);

    await connection.commit();
    return { infoLevelProgramMappingId, areaId };

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