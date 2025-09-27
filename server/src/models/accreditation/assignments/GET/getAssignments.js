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
      aa.id                        AS assignmentID,
      u.id                         AS taskForceID,
      u.user_uuid                  AS taskForceUUID,
      u.full_name                  AS taskForce,
      u.role                       AS role,
      ai.id                        AS accredID,
      ai.uuid                      AS accredUUID,
      ai.title                     AS accredTitle,
      ai.year                      AS accredYear,
      ab.name                      AS accredBody,
      al.id                        AS levelID,
      al.level_name                AS level,
      pr.id                        AS programID,
      pr.uuid                      AS programUUID,
      pr.program_name              AS program,
      a.id                         AS areaID,
      a.uuid                       AS areaUUID,
      a.area_name                  AS area,
      pa.id                        AS parameterID,
      pa.uuid                      AS parameterUUID,
      pa.parameter_name            AS parameter,
      spa.id                       AS sub_parameterID,
      spa.uuid                     AS sub_parameterUUID,
      spa.sub_parameter_name       AS sub_parameter,
      i.id                         AS indicatorID,
      i.uuid                       AS indicatorUUID,
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
