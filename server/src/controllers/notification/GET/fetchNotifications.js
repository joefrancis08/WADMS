import getNotifications from "../../../models/notification/GET/getNotifications.js";

const fetchNotifications = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ 
      message: 'User Id is required.', 
      success: false,
      errorCode: 'EMPTY_FIELD' 
    });
  }

  try {
    const result = await getNotifications(userId);

    res.status(200).json({
      success: true,
      notificationData: result
    });

  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error);
    throw error;
  }
};

export default fetchNotifications;