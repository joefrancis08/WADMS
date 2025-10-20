import getUserStatus from "../../../../models/user/GET/getUserStatus.js";

const fetchUserStatus = async (req, res) => {
  const { userId, email } = req.query;
  console.log({
    userId,
    email
  });

  if (!userId || !email) {
    return res.status(400).json({
      message: 'User ID and email is required.',
      success: false
    });
  } 

  try {
    const user = await getUserStatus(userId, email);

    if (!user) {
      return res.status(404).json({
        message: `No user found with the id ${userId}`,
        success: false
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error fetching user by status:', error);
    throw error;
  }
};

export default fetchUserStatus;