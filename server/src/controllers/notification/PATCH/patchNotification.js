import { updateIsRead } from "../../../models/notification/UPDATE/updateNotification.js";

const patchNotification = async (req, res) => {
  const { notifId, userId } = req.query;

  console.log(userId);

  if (!userId) {
    return res.status(400).json({
      message: 'User Id is required',
      success: false,
      errorCode: 'EMPTY_FIELD'
    });
  }
 
  try {
    const result = await updateIsRead(notifId, userId);
    console.log(result);

    res.status(200).json({
      message: 'Update successful.',
      success: true
    });
    
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};

export default patchNotification;