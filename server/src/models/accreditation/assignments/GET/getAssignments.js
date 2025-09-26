import db from "../../../../config/db.js";

const getAssignments = async (data, connection = null) => {
  const {
    accredInfoId,
    levelId,
    programId,
    areaId,
    parameterId,
    subParameterId,
    indicatorId
  } = data;

  const query = `
    SELECT
      aa.id                        AS assignment_id,
      u.full_name                  AS assigned,
      u.role                       AS role,
      ai.title                     AS accred_title,
      ai.year                      AS accred_year,
      ab.name                      AS accred_body,
      al.level_name                AS level,
      pr.program_name              AS program,
      a.area_name                  AS area,
      pa.parameter_name            AS parameter,
      spa.sub_parameter_name       AS sub_parameter,
      i.indicator_name             AS indicator
    FROM accreditation_assignment aa
    JOIN user u
      ON aa.user_id = u.id
    JOIN accreditation_info ai
      ON aa.accred_info_id = ai.id
    JOIN accreditation_body ab
      ON ai.accreditation_body_id = ab.id
    JOIN accreditation_level al
      ON aa.level_id = al.id
    JOIN program pr 
      ON aa.program_id = pr.id
    JOIN area a
      ON aa.area_id = a.id
    LEFT JOIN parameter pa
      ON aa.parameter_id = pa.id
    LEFT JOIN sub_parameter spa
      ON aa.sub_parameter_id = spa.id
    LEFT JOIN indicator i
      ON aa.indicator_id = i.id
    WHERE aa.accred_info_id = ?
      AND aa.level_id = ?
      AND aa.program_id = ?
      AND aa.area_id = ?
      AND (? IS NULL OR aa.parameter_id = ?)
      AND (? IS NULL OR aa.sub_parameter_id = ?)
      AND (? IS NULL OR aa.indicator_id = ?)
  `;

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query, [
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId, parameterId,
      subParameterId, subParameterId,
      indicatorId, indicatorId
    ]);

    return rows;

  } catch (error) {
    console.error('Error getting assignments:', error);
    throw error;
  }
};

export default getAssignments;