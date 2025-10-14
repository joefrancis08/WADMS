import bcrypt from 'bcrypt';
import dotenv from 'dotenv-flow';
import { getUserBy } from "../../../../models/user/GET/getUser.js";
import getOTP from '../../../../models/OTP/GET/getOTP.js';
import updateOTP from '../../../../models/OTP/UPDATE/updateOTP.js';
import insertOTP from '../../../../models/OTP/POST/insertOTP.js';
import transporter from '../../../../services/nodemailer/emailService.js';

dotenv.config({ quiet: true })

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Check if email and password is not empty
    if (!email.trim() || !password.trim()) {
      return res.status(400).json({
        message: 'Email and password must not empty.',
        success: false
      });
    }

    // Step 2: Check if email exist. If true, return email not found
    const userResult = await getUserBy('email', email, true, true, false);
    if (!userResult) {
      return res.status(404).json({
        message: 'Email not found.',
        success: false,
        emailNotFound: true
      });
    }

    // Step 3: Check password if matched.
    const hashedPassword = userResult.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password didn't match.",
        success: false,
        wrongPassword: true
      });
    }

    // Step 4: Generate OTP (6-digit) if conditions above met
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Step 5: Set expiration date of otp (5 minutes)
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // Step 6: Store otp in db
    // Step 6.1: Check if a record already exist in the db. If true, update it. Otherwise, insert new in db.
    const otpResult = await getOTP(email);
    if (otpResult && otpResult.id) {
      await updateOTP({ 
        otpCode: otp,
        expiresAt: expiry,
        email
      });

    } else {
      await insertOTP({
        otpCode: otp,
        expiresAt: expiry,
        userId: userResult.user_id
      });
    }

    // Step 7: Save user to session
    req.session.user = {
      email: userResult.email,
      fullName: userResult.full_name,
      role: userResult.role,
      status: userResult.status
    };

    // Step 8: Send email
    await transporter.sendMail({
      from: `"WDMS" <${process.env.EMAIL}>`,
      to: email,
      subject: `Your One-Time Password (OTP): ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fafafa;">
          <h2 style="color: #16a34a; text-align: center;">Your One-Time Password (OTP)</h2>
          <p style="text-align: center; font-size: 24px; font-weight: bold; color: #0f172a; margin: 20px 0;">${otp}</p>
          <p>This OTP is valid for <strong>5 minutes</strong>. Please use it before it expires.</p>
          <p style="font-size: 12px; color: gray;">If you did not request this OTP, please ignore this email.</p>
        </div>
      `,
    });


    // Step 9: Send a response including the email
    res.status(200).json({
      message: 'Logged in successfully!',
      success: true,
      user: req.session.user
    });

  } catch (error) {
    console.error('Error logging in:', error);

    res.status(500).json({
      message: 'An unexpected error occured.',
      success: false,
      error: error.code
    });
  }
};

export default login;