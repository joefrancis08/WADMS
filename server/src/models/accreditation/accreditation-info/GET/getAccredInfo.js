import db from '../../../../config/db.js';

/**
 * Fetch accreditation info records with optional filters.
 *
 * @param {Object} filters - Optional filters to narrow results.
 *   @param {string} [filters.title] - Accreditation title.
 *   @param {number} [filters.year] - Accreditation year.
 *   @param {string} [filters.accredBody] - Accreditation body name.
 *   @param {string} [filters.status] - Accreditation status ('active' | 'archived').
 * @param {object} [connection] - Optional MySQL connection (for transactions).
 *
 * @returns {Promise<Array>} List of accreditation info rows.
 */

const getAccredInfo = async (filters = {}, connection = null) => {
  const { title, year, accredBody, status } = filters;

  // Base query
  let query = `
    SELECT 
      ai.id,
      ai.uuid    AS accred_uuid,
      ai.title   AS accred_title,
      ai.year    AS accred_year,
      ai.status  AS accred_status,
      ab.name    AS accred_body
    FROM accreditation_info ai
    JOIN accreditation_body ab
      ON ai.accreditation_body_id = ab.id
  `;

  const conditions = [];
  const params = [];

  // Add filters dynamically
  if (title) {
    conditions.push('ai.title = ?');
    params.push(title.trim());
  }
  if (year) {
    conditions.push('ai.year = ?');
    params.push(year);
  }
  if (accredBody) {
    conditions.push('ab.name = ?');
    params.push(accredBody.trim());
  }
  if (status) {
    conditions.push('ai.status = ?');
    params.push(status);
  }

  // Apply WHERE clause if filters exist
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY ai.year DESC';

  try {
    const executor = connection || db;
    const [rows] = await executor.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Error fetching accreditation info:', error);
    throw error;
  }
};

export default getAccredInfo;
