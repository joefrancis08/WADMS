import db from '../../../../config/db.js';
import insertAssignment from '../../../../models/accreditation/assignments/POST/insertAssignment.js';
import updateAssignment from '../../../../models/accreditation/assignments/UPDATE/updateAssignment.js';
import sendUpdate from '../../../../services/websocket/sendUpdate.js';

const addAssignment = async (req, res) => {
  const {
    userIDList, ilpmId, pamId,
    apmId, pspmId, simId
  } = req.body;
  

  console.log({ 
    userIDList,
    ilpmId,
    pamId,
    apmId,
    pspmId,
    simId
  });

  if (!ilpmId || !pamId || !apmId || !pspmId || !simId) {
    return res.status(400).json({
      message: 'IDs of ILPM, PAM, APM, PSPM, and SIM are required.',
      success: false,
    });
  }

  const userIDs = Array.isArray(userIDList) ? userIDList : [userIDList];

  if (!userIDs.length || userIDs.some((id) => !id)) {
    return res.status(400).json({
      success: false,
      message: 'User IDs must be valid and not empty.',
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const commonData = { ilpmId, pamId, apmId, pspmId, simId };

    const results = [];

    for (const userId of userIDs) {
      // Queries with proper NULL handling
      const [existingArea] = await connection.execute(
        `SELECT id 
         FROM accreditation_assignment 
         WHERE user_id = ? 
           AND ilpm_id = ? 
           AND pam_id = ? 
           AND apm_id IS NULL
           AND pspm_id IS NULL 
           AND sim_id IS NULL`, 
           [userId, ilpmId, pamId]
      );

      const [existingParam] = apmId !== null
        ? await connection.execute(
          `SELECT id 
           FROM accreditation_assignment 
           WHERE user_id = ? 
             AND ilpm_id = ? 
             AND pam_id = ? 
             AND apm_id = ? 
             AND pspm_id IS NULL
             AND sim_id IS NULL`,
          [userId, ilpmId, pamId, apmId]
        )
        : [[]];

      const [existingSubParam] = apmId !== null && pspmId !== null
        ? await connection.execute(
          `SELECT id 
           FROM accreditation_assignment 
           WHERE user_id = ? 
             AND ilpm_id = ? 
             AND pam_id = ? 
             AND apm_id = ? 
             AND pspm_id = ? 
             AND sim_id IS NULL`,
          [userId, ilpmId, pamId, apmId, pspmId]
        )
        : [[]];

      const [existingIndicator] = apmId !== null && pspmId !== null && simId !== null
        ? await connection.execute(
          `SELECT id 
           FROM accreditation_assignment 
           WHERE user_id = ? 
             AND ilpm_id = ? 
             AND pam_id = ? 
             AND apm_id = ? 
             AND pspm_id = ? 
             AND sim_id = ?`,
          [userId, ilpmId, pamId, apmId, pspmId, simId]
        )
        : [[]];

      // New guards to block less-specific inserts
      const [existingAnySpecific] = await connection.execute(
        `SELECT id FROM accreditation_assignment
         WHERE user_id = ?
           AND ilpm_id = ?
           AND pam_id = ?
           AND apm_id = ?
           AND (
             pspm_id IS NOT NULL
             OR sim_id IS NOT NULL
           )`,
        [userId, ilpmId, pamId, apmId]
      );

      const [existingMoreSpecificParam] = apmId !== null
        ? await connection.execute(
          `SELECT id FROM accreditation_assignment
           WHERE user_id = ?
             AND ilpm_id = ?
             AND pam_id = ?
             AND apm_id = ?
             AND (pspm_id IS NOT NULL OR sim_id IS NOT NULL)`,
          [userId, ilpmId, pamId, apmId]
        )
        : [[]];

      const [existingMoreSpecificSubParam] = apmId !== null && simId !== null
        ? await connection.execute(
          `SELECT id FROM accreditation_assignment
           WHERE user_id = ?
             AND ilpm_id = ?
             AND pam_id = ?
             AND apm_id = ?
             AND pspm_id = ?
             AND sim_id IS NOT NULL`,
          [userId, ilpmId, pamId, apmId, pspmId]
        )
        : [[]];

      if (pspmId !== null && simId === null) {
        // Get all simId belong to pspmId
        const [sim] = await connection.execute(
          `SELECT id FROM subparam_indicator_mapping
          WHERE param_subparam_mapping_id = ?`,
          [pspmId]
        );

        for (const { id: simId } of sim) {
          // Check if assignment already exists for this indicator
          const [existingIndicatorAssignment] = await connection.execute(
            `SELECT id FROM accreditation_assignment
            WHERE user_id = ?
              AND ilpm_id = ?
              AND pam_id = ?
              AND apm_id = ?
              AND pspm_id = ?
              AND sim_id = ?`,
            [userId, ilpmId, pamId, apmId, pspmId, simId]
          );

          if (existingIndicatorAssignment.length === 0) {
            // Insert indicator-level assignment
            await insertAssignment({
              userId, ilpmId, pamId,
              apmId, pspmId, simId
            }, connection);

            results.push({ type: 'insert-sim', userId, simId });
          }
        }
      }

      // Decision making
      if (existingArea.length > 0) {
        if (apmId !== null || pspmId !== null || simId !== null) {
          await updateAssignment({ userId, ...commonData }, connection);
          results.push({ type: 'update', userId });
        } else {
          await connection.rollback();
          return res.status(409).json({
            message: 'Task Force is already assigned to this area.',
            success: false,
            error: { user: userId },
          });
        }

      } else if (existingParam.length > 0) {
        if (pspmId !== null || simId !== null) {
          await updateAssignment({ userId, ...commonData }, connection);
          results.push({ type: 'update', userId });
        } else {
          await connection.rollback();
          return res.status(409).json({
            message: 'Task Force is already assigned to this parameter.',
            success: false,
            error: { user: userId },
          });
        }

      } else if (existingSubParam.length > 0) {
        if (simId !== null) {
          await updateAssignment({ userId, ...commonData }, connection);
          results.push({ type: 'update', userId });
        } else {
          await connection.rollback();
          return res.status(409).json({
            message: 'Task Force is already assigned to this sub-parameter.',
            success: false,
            error: { user: userId },
          });
        }

      } else if (existingIndicator.length > 0) {
        await connection.rollback();
        return res.status(409).json({
          message: 'Task Force is already assigned to this indicator.',
          success: false,
          error: { user: userId },
        });

      } else if (
        // Block less-specific if more-specific exists
        (apmId === null && pspmId === null && simId === null && existingAnySpecific.length > 0) ||
        (apmId !== null && pspmId === null && simId === null && existingMoreSpecificParam.length > 0) ||
        (apmId !== null && pspmId !== null && simId === null && existingMoreSpecificSubParam.length > 0)
      ) {
        await connection.rollback();
        return res.status(409).json({
          message: 'A more specific assignment already exists; cannot assign at this level.',
          success: false,
          error: { user: userId },
        });

      } else {
        // Insert new assignment
        const insertRes = await insertAssignment({ userId, ...commonData }, connection);
        results.push({ type: 'insert', userId, insertId: insertRes.insertId });
      }
    }

    await connection.commit();
    sendUpdate('assignment-update');

    res.status(200).json({
      message: 'Assignments processed successfully!',
      success: true,
      results,
    });

  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }

    console.error('Error processing assignments:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Duplicate entry.',
        success: false,
        isDuplicate: true,
        error,
      });
    }

    res.status(500).json({
      message: 'An unexpected error occurred.',
      success: false,
    });

  } finally {
    if (connection) connection.release();
  }
};

export default addAssignment;
