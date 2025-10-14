import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import pool from '../../../config/db.js';

/**
 * Handles Google OAuth login and registration
 */
const googleAuth = async (req, res) => {
  const { token, mode } = req.body;

  try {
    // Step 1: Verify token and get Google user info
    const googleRes = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { sub: googleId, email, name, picture } = googleRes.data;
    console.log('Google verified user:', { googleId, name, email });

    // Step 2: Check if user already exists
    const [existing] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

    // Step 3: Handle new Google registration
    if (existing.length === 0) {
      if (mode === 'register') {
        const userUUID = uuidv4();
        const defaultPassword = '12345';
        const role = 'Unverified User';
        const status = 'Pending';

        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create a new pending account
        const [result] = await pool.query(
          `INSERT INTO user (user_uuid, google_id, full_name, email, password, profile_pic_path, role, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [userUUID, googleId, name, email, hashedPassword, picture, role, status]
        );

        const newUser = {
          user_id: result.insertId,
          user_uuid: userUUID,
          full_name: name,
          email,
          profile_pic_path: picture,
          role,
          status,
        };

        req.session.user = {
          userId: newUser.user_id,
          userUUID: newUser.user_uuid,
          email: newUser.email,
          fullName: newUser.full_name,
          profilePicPath: newUser.profile_pic_path,
          role: newUser.role,
          status: newUser.status,
        };

        // Force session save before responding
        req.session.save(err => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({
              success: false,
              message: 'Failed to save session.',
            });
          }

          console.log('Session created for new Google user:', req.session.user);
          return res.status(201).json({
            success: true,
            registered: true,
            approved: false,
            message: 'Account created! Waiting for admin approval.',
            user: req.session.user,
          });
        });
        return; // prevent double response
      }

      // If trying to log in but no account
      return res.status(404).json({
        success: false,
        message: 'No account found. Please register first.',
      });
    }

    // Step 4: Handle existing user
    const user = existing[0];

    // Case: user signed up manually (no google_id)
    if (!user.google_id) {
      return res.status(200).json({
        success: false,
        existWithoutGoogleId: true,
        message: 'An account with this email already exists. Log in using your email and password instead.',
      });
    }

    // Case: user is pending approval
    if (user.status === 'Pending') {
      return res.status(200).json({
        success: true,
        registered: true,
        approved: false,
        message: 'Account pending admin approval.',
      });
    }

    // Step 5: Create session for approved users
    req.session.user = {
      userId: user.id,
      userUUID: user.user_uuid,
      email: user.email,
      fullName: user.full_name,
      profilePicPath: user.profile_pic_path,
      role: user.role,
      status: user.status,
    };

    // Ensure session is stored before responding
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to save session.',
        });
      }

      console.log('Session created for existing Google user:', req.session.user);

      return res.status(200).json({
        success: true,
        registered: true,
        approved: true,
        message: 'Login successful.',
        user: req.session.user,
      });
    });
  } catch (error) {
    console.error('Google Auth Error:', error.message);
    return res.status(400).json({
      success: false,
      message: 'Google authentication failed. Please try again.',
    });
  }
};

export default googleAuth;
