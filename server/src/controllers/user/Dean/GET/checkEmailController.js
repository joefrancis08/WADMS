import { checkUserEmail } from "../../../../models/user/GET/getUser.js";

export const checkEmailController = async (req, res) => {
  const { email } = req.query;

  // Validate that email is provided
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  try {
    const user = await checkUserEmail(email.trim());

    return res.status(200).json({
      message: user ? 'Email already exists.' : 'Email is available.',
      alreadyExist: !!user,
    });

  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
    });
  }
};