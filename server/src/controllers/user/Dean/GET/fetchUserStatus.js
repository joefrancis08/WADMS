import getUserStatus from "../../../../models/user/GET/getUserStatus.js";

const fetchUserStatus = async (req, res) => {
  const { email } = req.query;
  console.log({
    email
  });

  if (!email) {
    return res.status(400).json({
      message: 'Email is required.',
      success: false
    });
  } 

  try {
    const user = await getUserStatus(email);

    if (!user) {
      return res.status(404).json({
        message: `No user found.`,
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