import bcrypt from 'bcrypt';
import { getUserByEmail } from "../../../models/userModel.js";

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: 'User not found.',
        success: false,
        isValid: false,
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({
        message: 'Invalid password.',
        success: false,
        isValid: false,
      });
    }

    // Save user to session
    req.session.user = {
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      status: user.status
    };

    return res.json({
      data: req.session.user,
      message: 'Logged in successfully.',
      success: true,
    });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({
      message: 'Server error.',
      success: false,
    });
  }
};