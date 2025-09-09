import db from "../../../../config/db.js";
import getAreaBy from "../../areas/GET/getAreaBy.js";
import getParameterBy from "../../parameters/GET/getParameterBy.js";
import insertParameter from "../../parameters/POST/insertParameter.js";

const insertAreaParameterMapping = async (startDate, endDate, level, program, area, parameter) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Step 1: Check if a parameter exist, if not, insert it.
    const parameterResult = await getParameterBy('parameter_name', parameter, connection);

    let parameterId;
    if (parameterResult.length > 0) {
      parameterId = parameterResult[0].id;

    } else {
      const areaResult = await getAreaBy('area_name', area, connection);

      if (!areaResult.length) {
        throw new Error('AREA_NOT_FOUND');
      }

      const areaID = areaResult[0].id;
      const newParameter = await insertParameter(parameter, areaID, connection);
      parameterId = newParameter.insertId;
    }

    // Step 2: Get the area_parameter_mapping id
    const programAreaMappingQuery = `
      SELECT pam.id
      FROM program_area_mapping pam
      JOIN program_level_mapping plm
        ON pam.program_level_mapping_id = plm.id
      JOIN accreditation_period ap
        ON plm.period_id = ap.id
      JOIN accreditation_level al
        ON plm.level_id = al.id
      JOIN program p
        ON plm.program_id = p.id
      JOIN area a
        ON pam.area_id = a.id
      WHERE ap.start_date = ?
        AND ap.end_date = ?
        AND al.level_name = ?
        AND p.program_name = ?
        AND a.area_name = ?
    `;

    const [rows] = await connection.execute(programAreaMappingQuery, [startDate, endDate, level, program, area]);

    if (rows.length === 0) {
      throw new Error('PROGRAM_AREA_MAPPING_NOT_FOUND');
    }

    const programAreaMappingId = rows[0].id;

    // Step 3: Check if area_parameter_mapping already exists
    const checkQuery = `
      SELECT id FROM area_parameter_mapping
      WHERE program_area_mapping_id = ? AND parameter_id = ?
    `;
    const [exists] = await connection.execute(checkQuery, [programAreaMappingId, parameterId]);
    if (exists.length > 0) {
      throw new Error('DUPLICATE_ENTRY');
    }

    // Step 4: Insert mapping
    const query = `
      INSERT INTO area_parameter_mapping (program_area_mapping_id, parameter_id) VALUES (?, ?)
    `;

    await connection.execute(query, [programAreaMappingId, parameterId]);

    await connection.commit();
    return { programAreaMappingId, parameterId };

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

export default insertAreaParameterMapping;

