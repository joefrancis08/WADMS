import jwt from 'jsonwebtoken';
import getOTP from "../../../models/OTP/GET/getOTP.js";
import updateOTP from "../../../models/OTP/UPDATE/updateOTP.js";
import { getUserBy } from "../../../models/user/GET/getUser.js";

const JWT_SECRET = process.env.JWT_SECRET;

const verifyOTP = async (req, res) => {
  const { email, otp = null } = req.body;

  console.log('OTP cred:', { email, otp });

  try {
    if (!email) {
      return res.status(400).json({ 
        message: 'Email are required.', 
        success: false 
      });
    }

    // Step 1: Get OTP record from DB
    const otpRecord = await getOTP(email);
    if (!otpRecord) {
      return res.status(404).json({ 
        message: 'No OTP found for this email.', 
        success: false 
      });
    }

    // Step 2: Check if OTP matches
    if (otpRecord.otp_code !== otp) {
      return res.status(400).json({ 
        message: 'Invalid OTP.', 
        success: false,
        wrongOTP: true
      });
    }

    // Step 3: Check if OTP expired
    const now = new Date();
    if (now > new Date(otpRecord.expires_at)) {
      return res.status(400).json({ 
        message: 'OTP has expired.', 
        success: false,
        expired: true
      });
    }

    // Step 4: Mark OTP as used (optional)
    await updateOTP({ otpCode: null, expiresAt: null, email });

    // Fetch the user for session/JWT payload
    const user = await getUserBy('email', email, true, true, false);

    // Mark OTP as used / clear it
    await updateOTP({ otpCode: null, expiresAt: null, email });

    // Create full authenticated session
    req.session.user = {
      userId: user.id,
      userUUID: user.user_uuid,
      email: user.email,
      fullName: user.full_name,
      profilePicPath: user.profile_pic_path,
      role: user.role,
      status: user.status
    };
    delete req.session.pendingUser;

    // Issue JWT
    const token = jwt.sign(
      {
        id: user.id,
        fullName: user.full_name,
        profilePicPath: user.profile_pic_path,
        role: user.role,
        status: user.status
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Step 5: Return success
    res.status(200).json({
      message: 'OTP verified successfully!',
      success: true,
      token,
      user: req.session.user
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      message: 'An unexpected error occurred.',
      success: false,
      error: error.message
    });
  }
};

export default verifyOTP;
