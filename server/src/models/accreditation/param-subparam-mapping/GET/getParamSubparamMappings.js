import db from "../../../../config/db.js";

const getParamSubparamMappings = async (startDate, endDate, levelName, programName, areaName, parameterName, connection = null) => {
  const query = `
    SELECT
      ap.start_date          AS period_start,
      ap.end_date            AS period_end,
      al.level_name          AS level,
      pr.program_name        AS program,
      a.area_name            AS area,
      pa.parameter_name      AS parameter,
      spa.uuid               AS sub_parameter_uuid,
      spa.sub_parameter_name AS sub_parameter
    FROM parameter_subparameter_mapping pspm
    JOIN area_parameter_mapping apm 
      ON pspm.area_parameter_mapping_id = apm.id
    JOIN program_area_mapping pam
      ON apm.program_area_mapping_id = pam.id
    JOIN program_level_mapping plm
      ON pam.program_level_mapping_id = plm.id
    JOIN accreditation_period ap
      ON plm.period_id = ap.id
    JOIN accreditation_level al
      ON plm.level_id = al.id
    JOIN program pr
      ON plm.program_id = pr.id
    JOIN area a
      ON pam.area_id = a.id
    JOIN parameter pa
      ON apm.parameter_id = pa.id
    JOIN sub_parameter spa
      ON pspm.subparameter_id
    WHERE ap.start_date = ?
      AND ap.end_date = ?
      AND al.level_name = ?
      AND pr.program_name = ?
      AND a.area_name = ?
      AND pa.parameter_name = ?
  `;

  try {
    let result;

    if (connection) {
      [result] = await connection.execute(query, [startDate, endDate, levelName, programName, areaName, parameterName]);

    } else {
      [result] = await db.execute(query, [startDate, endDate, levelName, programName, areaName, parameterName]);
    }

    return result;

  } catch (error) {
    console.error('Error fetching subparameters:', error);
    throw error;
  }
};

export default getParamSubparamMappings;