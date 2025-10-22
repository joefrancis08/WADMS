// controllers/auth/verifyOTP.js
import jwt from 'jsonwebtoken';
import getOTP from "../../../models/OTP/GET/getOTP.js";
import updateOTP from "../../../models/OTP/UPDATE/updateOTP.js";
import { getUserBy } from "../../../models/user/GET/getUser.js";

const JWT_SECRET = process.env.JWT_SECRET;

const verifyOTP = async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const otp = (req.body.otp || '').trim();

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.', success: false });
    }

    const otpRecord = await getOTP(email);
    if (!otpRecord) {
      return res.status(404).json({ message: 'No OTP found for this email.', success: false });
    }

    if (otpRecord.otp_code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.', success: false, wrongOTP: true });
    }

    const now = new Date();
    if (now > new Date(otpRecord.expires_at)) {
      return res.status(400).json({ message: 'OTP has expired.', success: false, expired: true });
    }

    const user = await getUserBy('email', email, true, true, false);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.', success: false });
    }

    // Clear OTP once
    await updateOTP({ otpCode: null, expiresAt: null, email });

    // Fresh authenticated session
    req.session.regenerate(err => {
      if (err) return res.status(500).json({ success: false, message: 'Failed to start session.' });

      req.session.user = {
        userId: user.id,
        userUUID: user.user_uuid,
        email: user.email,
        fullName: user.full_name,
        profilePicPath: user.profile_pic_path,
        role: user.role,
        status: user.status,
      };

      delete req.session.pendingUser;

      req.session.save(err2 => {
        if (err2) return res.status(500).json({ success: false, message: 'Failed to save session.' });

        const token = JWT_SECRET
          ? jwt.sign(
              req.session.user,
              JWT_SECRET,
              { expiresIn: '7d' }
            )
          : null;

        return res.status(200).json({
          message: 'OTP verified successfully!',
          success: true,
          token,
          user: req.session.user,
        });
      });
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.', success: false, error: error.message });
  }
};

export default verifyOTP;
