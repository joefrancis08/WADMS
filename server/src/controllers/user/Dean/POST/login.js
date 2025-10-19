import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv-flow';
import { getUserBy } from "../../../../models/user/GET/getUser.js";
import getOTP from '../../../../models/OTP/GET/getOTP.js';
import updateOTP from '../../../../models/OTP/UPDATE/updateOTP.js';
import insertOTP from '../../../../models/OTP/POST/insertOTP.js';
import transporter from '../../../../services/nodemailer/emailService.js';

dotenv.config({ quiet: true });
const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email.trim() || !password.trim()) {
      return res.status(400).json({
        message: 'Email and password must not be empty.',
        success: false
      });
    }

    const userResult = await getUserBy('email', email, true, true, false);
    if (!userResult) {
      return res.status(404).json({
        message: 'Email not found.',
        success: false,
        emailNotFound: true
      });
    }

    const isMatch = await bcrypt.compare(password, userResult.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password didn't match.",
        success: false,
        wrongPassword: true
      });
    }

    // Generate OTP and send email (same logic)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    const otpResult = await getOTP(email);
    if (otpResult && otpResult.id) {
      await updateOTP({ otpCode: otp, expiresAt: expiry, email });
    } else {
      await insertOTP({ otpCode: otp, expiresAt: expiry, userId: userResult.user_id });
    }

    // Create a JWT
    const token = jwt.sign(
      {
        id: userResult.user_id,
        fullName: userResult.full_name,
        profilePicPath: userResult.profile_pic_path,
        role: userResult.role,
        status: userResult.status
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Optionally store user info in session if needed
    req.session.user = {
      email: userResult.email,
      fullName: userResult.full_name,
      profilePicPath: userResult.profile_pic_path,
      role: userResult.role,
      status: userResult.status
    };

    // Send OTP email
    await transporter.sendMail({
      from: `"WDMS" <${process.env.EMAIL}>`,
      to: email,
      subject: `Your One-Time Password (OTP): ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Your One-Time Password (OTP)</h2>
          <p><b>${otp}</b> — valid for 5 minutes.</p>
        </div>
      `,
    });

    // Instead of setting cookie, return token in JSON
    return res.status(200).json({
      message: 'Logged in successfully!',
      success: true,
      token,       
      user: req.session.user
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      message: 'An unexpected error occurred.',
      success: false,
      error: error.code
    });
  }
};

export default login;
