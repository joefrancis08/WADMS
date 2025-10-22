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
    indicatorId = null
  } = req.body;

  console.log({ userIDList,
    accredInfoId,
    levelId,
    programId,
    areaId,
    parameterId,
    subParameterId,
    indicatorId })

  if (!accredInfoId || !levelId || !programId || !areaId) {
    return res.status(400).json({
      message: 'IDs of accreditation, level, program, and area are required.',
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
      // --- Queries with proper NULL handling ---
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

      const [existingParam] = parameterId !== null
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

      const [existingSubParam] = parameterId !== null && subParameterId !== null
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

      const [existingIndicator] = parameterId !== null && subParameterId !== null && indicatorId !== null
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

      // --- New guards to block less-specific inserts ---
      const [existingAnySpecific] = await connection.execute(
        `SELECT id FROM accreditation_assignment
         WHERE user_id = ?
           AND accred_info_id = ?
           AND level_id = ?
           AND program_id = ?
           AND area_id = ?
           AND (
             parameter_id IS NOT NULL
             OR subparameter_id IS NOT NULL
             OR indicator_id IS NOT NULL
           )`,
        [userId, accredInfoId, levelId, programId, areaId]
      );

      const [existingMoreSpecificParam] = parameterId !== null
        ? await connection.execute(
          `SELECT id FROM accreditation_assignment
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

      const [existingMoreSpecificSubParam] = parameterId !== null && subParameterId !== null
        ? await connection.execute(
          `SELECT id FROM accreditation_assignment
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

      if (subParameterId !== null && indicatorId === null) {
        // Get all indicators belonging to this subparameter
        const [indicators] = await connection.execute(
          `SELECT id FROM indicator WHERE subparam_id = ?`,
          [subParameterId]
        );

        for (const { id: indicatorId } of indicators) {
          // Check if assignment already exists for this indicator
          const [existingIndicatorAssignment] = await connection.execute(
            `SELECT id FROM accreditation_assignment
            WHERE user_id = ?
              AND accred_info_id = ?
              AND level_id = ?
              AND program_id = ?
              AND area_id = ?
              AND parameter_id = ?
              AND subparameter_id = ?
              AND indicator_id = ?`,
            [userId, accredInfoId, levelId, programId, areaId, parameterId, subParameterId, indicatorId]
          );

          if (existingIndicatorAssignment.length === 0) {
            // Insert indicator-level assignment
            await insertAssignment({
              userId,
              accredInfoId,
              levelId,
              programId,
              areaId,
              parameterId,
              subParameterId,
              indicatorId,
            }, connection);

            results.push({ type: 'insert-indicator', userId, indicatorId });
          }
        }
      }

      // --- Decision making ---
      if (existingArea.length > 0) {
        if (parameterId !== null || subParameterId !== null || indicatorId !== null) {
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
        if (subParameterId !== null || indicatorId !== null) {
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
        if (indicatorId !== null) {
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
        (parameterId === null && subParameterId === null && indicatorId === null && existingAnySpecific.length > 0) ||
        (parameterId !== null && subParameterId === null && indicatorId === null && existingMoreSpecificParam.length > 0) ||
        (parameterId !== null && subParameterId !== null && indicatorId === null && existingMoreSpecificSubParam.length > 0)
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

        await insertNotification({ 
          userId,
          accredInfoId,
          levelId,
          programId,
          areaId,
          parameterId,
          subParameterId,
          title: 'Assignment',
          type: 'assignment'
        });
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