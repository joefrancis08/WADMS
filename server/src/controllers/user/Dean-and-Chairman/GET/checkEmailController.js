import { getUserByEmail } from "../../../../models/userModel.js";

export const checkEmailController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (user) {
      return res.status(200).json({
        message: 'Email already exists.',
        success: false,
        alreadyExists: true,
        data: user
      });
    }

    return res.status(200).json({
      message: 'Email is available.',
      success: true,
      alreadyExists: false,
    });

  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
    });
  }
}
