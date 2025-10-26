import db from "../../../config/db.js";

const getNotifications = async (userId) => {
  const query = `
    SELECT
      n.id                     AS notifId, 
      n.type                   AS notifType,
      n.created_at             AS notifDate,
      n.is_read                AS isRead,
      n.user_id                AS userId,
      u.full_name              AS fullName,
      ai.title                 AS accredTitle,
      ai.year                  AS accredYear,
      al.level_name            AS level,
      pr.program_name          AS program,
      a.area_name              AS area,
      p.parameter_name         AS parameter,
      sp.sub_parameter_name AS subparameter
    FROM notification n
    JOIN user u
      ON n.user_id = u.id
    JOIN accreditation_info ai
      ON n.accred_info_id = ai.id
    JOIN accreditation_level al
      ON n.level_id = al.id
    JOIN program pr
      ON n.program_id = pr.id
    JOIN area a
      ON n.area_id = a.id
    LEFT JOIN parameter p
      ON n.parameter_id = p.id
    LEFT JOIN sub_parameter sp
      ON n.subparameter_id = sp.id
    WHERE user_id = ?
    ORDER BY n.is_read ASC, n.created_at DESC
  `;

  try {
    const [rows] = await db.execute(query, [userId]);
    return rows;

  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export default getNotifications;