import db from "../../../../config/db.js";

const getAssignments = async (accredData = {}, userData = {}, condition = {}, connection = null) => {
  const {
    accredInfoId = null,
    levelId = null,
    programId = null,
    areaId = null,
    parameterId = null,
    subParameterId = null,
    indicatorId = null
  } = accredData;

  const {
    userId = null
  } = userData;

  const {
    forDeanTaskForceDetailPage,
    forDeanAssignmentPage
  } = condition;

  // Build WHERE clause dynamically
  let whereClause = [];
  let params = [];

  if (forDeanTaskForceDetailPage) {
    whereClause.push("aa.user_id = ?");
    params.push(userId);
  }

  if (forDeanAssignmentPage) {
    if (accredInfoId !== null) {
      whereClause.push("aa.accred_info_id = ?");
      params.push(accredInfoId);
    }
    if (levelId !== null) {
      whereClause.push("aa.level_id = ?");
      params.push(levelId);
    }
    if (programId !== null) {
      whereClause.push("aa.program_id = ?");
      params.push(programId);
    }
    if (areaId !== null) {
      whereClause.push("aa.area_id = ?");
      params.push(areaId);
    }
    if (parameterId !== null) {
      whereClause.push("aa.parameter_id = ?");
      params.push(parameterId);
    }
    if (subParameterId !== null) {
      whereClause.push("aa.sub_parameter_id = ?");
      params.push(subParameterId);
    }
    if (indicatorId !== null) {
      whereClause.push("aa.indicator_id = ?");
      params.push(indicatorId);
    }
  }

  const query = `
    SELECT
      aa.id                        AS assignment_id,
      u.id                         AS task_force_id,
      u.user_uuid                  AS task_force_uuid,
      u.full_name                  AS task_force,
      u.role                       AS role,
      ai.id                        AS accred_id,
      ai.uuid                      AS accred_uuid,
      ai.title                     AS accred_title,
      ai.year                      AS accred_year,
      ab.name                      AS accred_body,
      al.id                        AS level_id,
      al.level_name                AS level,
      pr.id                        AS program_id,
      pr.uuid                      AS program_uuid,
      pr.program_name              AS program,
      a.id                         AS area_id,
      a.uuid                       AS area_uuid,
      a.area_name                  AS area,
      pa.id                        AS parameter_id,
      pa.uuid                      AS parameter_uuid,
      pa.parameter_name            AS parameter,
      spa.id                       AS sub_parameter_id,
      spa.uuid                     AS sub_parameter_uuid,
      spa.sub_parameter_name       AS sub_parameter,
      i.id                         AS indicator_id,
      i.uuid                       AS indicator_uuid,
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
    ${whereClause.length ? `WHERE ${whereClause.join(" AND ")}` : ""}
  `;

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error getting assignments:", error);
    throw error;
  }
};

export default getAssignments;
