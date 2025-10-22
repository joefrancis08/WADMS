// controllers/auth/googleAuth.js
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import pool from '../../../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET;

const googleAuth = async (req, res) => {
  const { token, mode } = req.body;

  try {
    // 1) Verify Google token
    const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { sub: googleId, email, name, picture } = googleRes.data || {};
    if (!email) {
      return res.status(400).json({ success: false, message: 'Google did not return an email.' });
    }

    // 2) Find existing user
    const [existing] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

    // 3) New user: registration flow (no session yet; status Pending)
    if (existing.length === 0) {
      if (mode !== 'register') {
        return res.status(404).json({ success: false, message: 'No account found. Please register first.' });
      }

      const userUUID = uuidv4();
      const defaultPassword = '12345'; // consider generating random if unused
      const role = 'Unverified User';
      const status = 'Pending';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await pool.query(
        `INSERT INTO user (user_uuid, google_id, full_name, email, password, profile_pic_path, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userUUID, googleId, name, email, hashedPassword, picture, role, status]
      );

      // Do NOT create a session for Pending users; no JWT either
      return res.status(201).json({
        success: true,
        registered: true,
        approved: false,
        message: 'Account created! Waiting for admin approval.',
      });
    }

    // 4) Existing user
    const user = existing[0];

    // If email exists but not linked to Google
    if (!user.google_id) {
      return res.status(200).json({
        success: false,
        existWithoutGoogleId: true,
        message: 'An account with this email already exists. Log in using your email and password instead.',
      });
    }

    // If still pending, do not create session/JWT
    if (user.status === 'Pending') {
      return res.status(200).json({
        success: true,
        registered: true,
        approved: false,
        message: 'Account pending admin approval.',
      });
    }

    // 5) Approved user: create fresh session + JWT
    req.session.regenerate(err => {
      if (err) {
        console.error('Session regenerate error:', err);
        return res.status(500).json({ success: false, message: 'Failed to start session.' });
      }

      const sessionUser = {
        userId: user.id,
        userUUID: user.user_uuid,
        email: user.email,
        fullName: user.full_name,
        profilePicPath: user.profile_pic_path,
        role: user.role,
        status: user.status,
      };
      req.session.user = sessionUser;

      req.session.save(err2 => {
        if (err2) {
          console.error('Session save error:', err2);
          return res.status(500).json({ success: false, message: 'Failed to save session.' });
        }

        const accessToken = JWT_SECRET
          ? jwt.sign(
              {
                userId: user.id,
                userUUID: user.user_uuid,
                email: user.email,
                fullName: user.full_name,
                profilePicPath: user.profile_pic_path,
                role: user.role,
                status: user.status,
              },
              JWT_SECRET,
              { expiresIn: '7d' }
            )
          : null;

        return res.status(200).json({
          success: true,
          registered: true,
          approved: true,
          message: 'Login successful.',
          token: accessToken,
          user: sessionUser,
        });
      });
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(400).json({ success: false, message: 'Google authentication failed. Please try again.' });
  }
};

export default googleAuth;
