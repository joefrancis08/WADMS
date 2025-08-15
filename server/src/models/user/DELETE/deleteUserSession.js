import db from "../../../config/db.js";

export const deleteUserSession = async (uuid) => {
  const [sessions] = await db.execute('SELECT session_id, data FROM sessions');

  const sessionIdsToDelete = [];

  sessions.forEach(session => {
    try {
      const sessionData = JSON.parse(session.data);
      if (sessionData.user?.userUUID === uuid) {
        sessionIdsToDelete.push(session.session_id);
      }

    } catch (error) {
      console.error('Error parsing session data: ', error);
    }
  });

  if (sessionIdsToDelete.length > 0) {
    const placeholders = sessionIdsToDelete.map(() => '?').join(',');
    await db.execute(`DELETE FROM sessions WHERE session_id IN (${placeholders})`, sessionIdsToDelete);
  }
}