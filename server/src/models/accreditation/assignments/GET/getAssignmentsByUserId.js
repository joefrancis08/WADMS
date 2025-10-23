import db from "../../../../config/db.js";

const getAssignmentsByUserId = async (userId) => {
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
      spa.id                       AS subParameterID,
      spa.uuid                     AS subParameterUUID,
      spa.sub_parameter_name       AS subParameter,
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
      ON aa.subparameter_id = spa.id
    LEFT JOIN indicator i
      ON aa.indicator_id = i.id
    WHERE user_id = ?
  `;

  try {
    const [rows] = await db.execute(query, [userId]);
    return rows;

  } catch (error) {
    console.error("Error getting assignments by user id:", error);
    throw error;
  }
};

export default getAssignmentsByUserId;