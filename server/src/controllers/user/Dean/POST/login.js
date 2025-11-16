import bcrypt from 'bcrypt';
import { getUserBy } from '../../../../models/user/GET/getUser.js';
import getOTP from '../../../../models/OTP/GET/getOTP.js';
import updateOTP from '../../../../models/OTP/UPDATE/updateOTP.js';
import insertOTP from '../../../../models/OTP/POST/insertOTP.js';
import transporter from '../../../../services/nodemailer/emailService.js';

const login = async (req, res) => {
  // Normalize inputs
  const email = (req.body.email || '').trim().toLowerCase();
  const password = (req.body.password || '').trim();

  console.log({ email, password });

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.', success: false });
    }

    const user = await getUserBy('email', email, true, true, false);
    
    // Avoiding user enumeration
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid credentials.', 
        success: false,
        emailNotFound: true
      });
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ 
          message: 'Invalid credentials.', 
          success: false, 
          wrongPassword: true 
        });
      }
    }

    // Generate and upsert OTP (valid 5 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const otpRow = await getOTP(email);
    if (otpRow?.id) {
      await updateOTP({ otpCode: otp, expiresAt, email });
    } else {
      await insertOTP({ otpCode: otp, expiresAt, userId: user.id });
    }

    // Send OTP email
    const BRAND_GREEN = '#16A34A';
    const SLATE_50 = '#F8FAFC';
    const SLATE_100 = '#F1F5F9';
    const SLATE_200 = '#E2E8F0';
    const SLATE_600 = '#475569';
    const SLATE_900 = '#0F172A';

    await transporter.sendMail({
      from: `"WDMS" <${process.env.EMAIL}>`,
      to: email,
      subject: `Your One-Time Password (OTP): ${otp}`,
      text: `Your OTP is ${otp}. It’s valid for 5 minutes. If you didn’t request this, you can ignore this email.`,
      html: `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>WDMS OTP</title>
        <style>
          @media (max-width: 600px) {
            .container { width: 100% !important; }
            .card { padding: 20px !important; }
            .otp { font-size: 28px !important; letter-spacing: 4px !important; }
            .cta { display: block !important; width: 100% !important; }
          }
        </style>
      </head>
      <body style="margin:0;padding:0;background:${SLATE_100};color:${SLATE_900};">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
          Your WDMS one-time password (OTP) is ${otp}. It expires in 5 minutes.
        </div>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${SLATE_100};">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="600" style="width:600px;max-width:600px;">
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px 12px 0 0;overflow:hidden;">
                      <tr>
                        <td align="left" style="background:${SLATE_900};padding:14px 20px;">
                          <span style="display:inline-block;color:#fff;font-weight:700;font-size:16px;letter-spacing:.2px;">WDMS</span>
                        </td>
                        <td align="right" style="background:${SLATE_900};padding:14px 20px;">
                          <span style="display:inline-block;color:#cbd5e1;font-size:12px;">Security Code</span>
                        </td>
                      </tr>
                      <tr><td colspan="2" style="height:4px;background:${BRAND_GREEN};"></td></tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="card" style="background:#fff;border:1px solid ${SLATE_200};border-top:none;border-radius:0 0 12px 12px;box-shadow:0 6px 18px rgba(2,6,23,0.06);padding:28px;">
                    <h1 style="margin:0 0 8px 0;font-size:22px;line-height:1.3;color:${SLATE_900};">Your one-time password</h1>
                    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:${SLATE_600};">
                      Use the code below to continue signing in. This code is valid for <strong>5 minutes</strong>.
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">
                      <tr>
                        <td align="center" style="padding:16px;border:1px solid ${SLATE_200};border-radius:10px;background:${SLATE_50};">
                          <div class="otp" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:32px; letter-spacing:6px; color:${SLATE_900}; font-weight:700;">
                            ${otp}
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 12px 0;font-size:13px;line-height:1.6;color:${SLATE_600};">
                      Didn’t request this code? You can safely ignore this message. Someone may have entered your email by mistake.
                    </p>
                    <hr style="border:none;border-top:1px solid ${SLATE_200};margin:18px 0;" />
                    <p style="margin:0;font-size:12px;line-height:1.6;color:${SLATE_600};">
                      Having trouble? Try copying the code manually. If issues persist, contact support at
                      <a href="mailto:${process.env.EMAIL}" style="color:${BRAND_GREEN};text-decoration:none;">${process.env.EMAIL}</a>.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:16px 8px;color:${SLATE_600};font-size:12px;">
                    © ${new Date().getFullYear()} WDMS • All rights reserved
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
    });

    return res.status(200).json({
      message: 'OTP sent if credentials are valid.',
      success: true,
      requiresOTP: true,
      tempUser: { email }
    });
    
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.', success: false });
  }
};

export default login;
