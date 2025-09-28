import db from "../../../../config/db.js";
import insertAssignment from "../../../../models/accreditation/assignments/POST/insertAssignment.js";
import sendUpdate from "../../../../services/websocket/sendUpdate.js";

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

  if (!accredInfoId || !levelId || !programId || !areaId) {
    return res.status(400).json({
      message: 'IDs of accreditation, level, program, and area are required.',
      success: false
    });
  }

  const userIDs = Array.isArray(userIDList) ? userIDList : [userIDList];

  if (!userIDs.length || userIDs.some(id => !id)) {
    return res.status(400).json({
      success: false,
      message: 'User IDs must be valid and not empty.'
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const commonData = { accredInfoId, levelId, programId, areaId, parameterId, subParameterId, indicatorId };

    const results = await Promise.all(
      userIDs.map(userId => insertAssignment({ userId, ...commonData }, connection))
    );

    await connection.commit();
    sendUpdate('assignment-update');

    res.status(200).json({
      message: 'Assignments added successfully!',
      success: true,
      assignmentIds: results.map(r => r.insertId)
    });

  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }

    console.error('Error adding assignment:', error);

    if (error.message === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        message: 'Duplicate entry.',
        success: false,
        isDuplicate: true
      });
    }

    res.status(500).json({
      message: 'An unexpected error occurred.',
      success: false
    });

  } finally {
    if (connection) connection.release();
  }
};

export default addAssignment;
