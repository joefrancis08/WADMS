import transporter from "../../../services/nodemailer/emailService.js";

const shareToken = async (req, res) => {
  const { email, fullName, accessLink } = req.body;

  try {
    if (!accessLink.trim()) {
      return res.status(400).json({
        message: 'Access Link is required.',
        success: false
      });
    }

    // Simple HTML-escape helper to avoid accidental injection
    const escapeHTML = (str = '') => {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    }

    await transporter.sendMail({
      from: `'WDMS' <${process.env.EMAIL}>`,
      to: email,
      subject: 'Your WDMS Access Link',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 24px;">
          <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0,0.05);">
            <div style="background:#4f46e5; color:#ffffff; padding:18px 20px; text-align:center;">
              <h1 style="margin:0; font-size:18px; line-height:1.2;">${escapeHTML('WDMS Access Link')}</h1>
            </div>

            <div style="padding:22px;">
              <h2 style="margin:0 0 12px; font-size:16px; color:#111827;">
                Dear ${escapeHTML(fullName)}, 
              </h2>
              <div style="color:#333; font-size:14px; line-height: 1.6; margin-bottom:18px;">
                You have been granted temporary access to a section of our system.
                Click "Open Link" to access the section.
              </div>
            

              <div style="text-align:left; margin:16px 0">
                <a href="${accessLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block; text-decoration:none; padding:10px 16px; border-radius:6px; font-weight:600; font-size:14px; color:#ffffff; background:#4f46e5">
                  Open Link
                </a>
              </div>

              <p style="color:#6b7280; font-size:13px; margin-top:20px;">
                If you didn't request this, you can ignore this email.
              </p>

              <p style="margin:16px 0 0 0; font-size:14px; color:#111827;">
                Best regards, <br/>
                <strong>CGS WDMS Team</strong>
              </p>
            </div>

            <div style="background:#f4f4f7; color:#6b7280; text-align:center; padding:12px; font-size:12px;">
              &copy; ${new Date().getFullYear()} CGS WDMS. All rights reserved.
            </div>
          </div>
        </div>
      `,
    });

    res.status(200).json({
      message: `Access link successfully shared to ${email}!`,
      success: true
    });
    
  } catch (error) {
    console.error('Error sharing email:', error);
    throw error;
  }
};

export default shareToken;