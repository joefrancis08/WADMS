import db from '../../../../config/db.js';
import insertAssignment from '../../../../models/accreditation/assignments/POST/insertAssignment.js';
import updateAssignment from '../../../../models/accreditation/assignments/UPDATE/updateAssignment.js';
import insertNotification from '../../../../models/notification/POST/insertNotification.js';
import sendUpdate from '../../../../services/websocket/sendUpdate.js';

const addAssignment = async (req, res) => {
  const {
    userIDList,
    accredInfoId,
    levelId,
    programId,
    areaId,
    parameterId = null,
    subParameterId = null,
    indicatorId = null,
  } = req.body;

  // Basic required IDs
  if (!accredInfoId || !levelId || !programId || !areaId) {
    return res.status(400).json({
      message: 'IDs of accreditation, level, program, and area are required.',
      success: false,
    });
  }

  // Normalize user IDs to an array
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

    const commonData = {
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId,
      subParameterId,
      indicatorId,
    };

    const results = [];

    for (const userId of userIDs) {
      // -----------------------------
      // Lookups (with proper NULL handling)
      // -----------------------------
      const [existingArea] = await connection.execute(
        `SELECT id
           FROM accreditation_assignment
          WHERE user_id = ?
            AND accred_info_id = ?
            AND level_id = ?
            AND program_id = ?
            AND area_id = ?
            AND parameter_id IS NULL
            AND subparameter_id IS NULL
            AND indicator_id IS NULL`,
        [userId, accredInfoId, levelId, programId, areaId]
      );

      const [existingParam] =
        parameterId !== null
          ? await connection.execute(
              `SELECT id
                 FROM accreditation_assignment
                WHERE user_id = ?
                  AND accred_info_id = ?
                  AND level_id = ?
                  AND program_id = ?
                  AND area_id = ?
                  AND parameter_id = ?
                  AND subparameter_id IS NULL
                  AND indicator_id IS NULL`,
              [userId, accredInfoId, levelId, programId, areaId, parameterId]
            )
          : [[]];

      const [existingSubParam] =
        parameterId !== null && subParameterId !== null
          ? await connection.execute(
              `SELECT id
                 FROM accreditation_assignment
                WHERE user_id = ?
                  AND accred_info_id = ?
                  AND level_id = ?
                  AND program_id = ?
                  AND area_id = ?
                  AND parameter_id = ?
                  AND subparameter_id = ?
                  AND indicator_id IS NULL`,
              [userId, accredInfoId, levelId, programId, areaId, parameterId, subParameterId]
            )
          : [[]];

      const [existingIndicator] =
        parameterId !== null && subParameterId !== null && indicatorId !== null
          ? await connection.execute(
              `SELECT id
                 FROM accreditation_assignment
                WHERE user_id = ?
                  AND accred_info_id = ?
                  AND level_id = ?
                  AND program_id = ?
                  AND area_id = ?
                  AND parameter_id = ?
                  AND subparameter_id = ?
                  AND indicator_id = ?`,
              [userId, accredInfoId, levelId, programId, areaId, parameterId, subParameterId, indicatorId]
            )
          : [[]];

      // Guards to block less-specific inserts when a more-specific one exists
      const [existingAnySpecific] = await connection.execute(
        `SELECT id
           FROM accreditation_assignment
          WHERE user_id = ?
            AND accred_info_id = ?
            AND level_id = ?
            AND program_id = ?
            AND area_id = ?
            AND (
              parameter_id IS NOT NULL OR
              subparameter_id IS NOT NULL OR
              indicator_id IS NOT NULL
            )`,
        [userId, accredInfoId, levelId, programId, areaId]
      );

      const [existingMoreSpecificParam] =
        parameterId !== null
          ? await connection.execute(
              `SELECT id
                 FROM accreditation_assignment
                WHERE user_id = ?
                  AND accred_info_id = ?
                  AND level_id = ?
                  AND program_id = ?
                  AND area_id = ?
                  AND parameter_id = ?
                  AND (subparameter_id IS NOT NULL OR indicator_id IS NOT NULL)`,
              [userId, accredInfoId, levelId, programId, areaId, parameterId]
            )
          : [[]];

      const [existingMoreSpecificSubParam] =
        parameterId !== null && subParameterId !== null
          ? await connection.execute(
              `SELECT id
                 FROM accreditation_assignment
                WHERE user_id = ?
                  AND accred_info_id = ?
                  AND level_id = ?
                  AND program_id = ?
                  AND area_id = ?
                  AND parameter_id = ?
                  AND subparameter_id = ?
                  AND indicator_id IS NOT NULL`,
              [userId, accredInfoId, levelId, programId, areaId, parameterId, subParameterId]
            )
          : [[]];

      // -----------------------------
      // Decision making
      // (Do NOT insert indicators yet. We do that AFTER we confirm/insert/update this level.)
      // -----------------------------
      if (existingArea.length > 0) {
        if (parameterId !== null || subParameterId !== null || indicatorId !== null) {
          await updateAssignment({ userId, ...commonData }, connection);
          results.push({ type: 'update-from-area', userId });
        } else {
          await connection.rollback();
          return res.status(409).json({
            message: 'Task Force is already assigned to this area.',
            success: false,
            error: { user: userId },
          });
        }
      } else if (existingParam.length > 0) {
        if (subParameterId !== null || indicatorId !== null) {
          await updateAssignment({ userId, ...commonData }, connection);
          results.push({ type: 'update-from-param', userId });
        } else {
          await connection.rollback();
          return res.status(409).json({
            message: 'Task Force is already assigned to this parameter.',
            success: false,
            error: { user: userId },
          });
        }
      } else if (existingSubParam.length > 0) {
        if (indicatorId !== null) {
          await updateAssignment({ userId, ...commonData }, connection);
          results.push({ type: 'update-from-subparam', userId });
        } else {
          // Important: don't rollback—treat as no-op so we can still ensure indicators below.
          results.push({ type: 'noop-subparam-exists', userId });
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
        (parameterId === null &&
          subParameterId === null &&
          indicatorId === null &&
          existingAnySpecific.length > 0) ||
        (parameterId !== null &&
          subParameterId === null &&
          indicatorId === null &&
          existingMoreSpecificParam.length > 0) ||
        (parameterId !== null &&
          subParameterId !== null &&
          indicatorId === null &&
          existingMoreSpecificSubParam.length > 0)
      ) {
        await connection.rollback();
        return res.status(409).json({
          message: 'A more specific assignment already exists; cannot assign at this level.',
          success: false,
          error: { user: userId },
        });
      } else {
        // Insert new assignment at the requested level
        const insertRes = await insertAssignment({ userId, ...commonData }, connection);
        results.push({ type: 'insert', userId, insertId: insertRes.insertId });

        await insertNotification({
          userId,
          accredInfoId,
          levelId,
          programId,
          areaId,
          parameterId,
          subParameterId,
          title: 'Assignment',
          type: 'assignment',
        });
      }

      // -----------------------------
      // Ensure indicator-level assignments when assigning at sub-parameter level
      // (Do this AFTER the decision logic above; make it idempotent)
      // Conditions: we’re at subparam scope (parameterId, subParameterId set) and no specific indicatorId provided
      // -----------------------------
      if (parameterId !== null && subParameterId !== null && indicatorId === null) {
        // Use INSERT IGNORE with a UNIQUE KEY on the composite fields to make this idempotent.
        await connection.execute(
          `
            INSERT IGNORE INTO accreditation_assignment
              (user_id, accred_info_id, level_id, program_id, area_id, parameter_id, subparameter_id, indicator_id)
            SELECT ?, ?, ?, ?, ?, ?, ?, i.id
              FROM indicator i
             WHERE i.subparam_id = ?
          `,
          [
            userId,
            accredInfoId,
            levelId,
            programId,
            areaId,
            parameterId,
            subParameterId,
            subParameterId,
          ]
        );

        // Optional: add notifications per indicator (skip if noisy), or one summary line:
        results.push({ type: 'ensure-indicators', userId, subParameterId });
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

    if (error?.code === 'ER_DUP_ENTRY') {
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
