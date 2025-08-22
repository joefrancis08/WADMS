import { checkUserEmail } from "../../../../models/user/GET/getUser.js";

export const checkEmailController = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await checkUserEmail(email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (user) {
      return res.status(200).json({
        message: 'Email already exist.',
        alreadyExist: user,
      });
    }

    return res.status(200).json({
      message: 'Email is available.',
      alreadyExist: user,
    });

  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
    });
  }
}
