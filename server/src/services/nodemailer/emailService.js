import nodemailer from 'nodemailer';
import dotenv from 'dotenv-flow';

dotenv.config({ quiet: true });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Gmail account that sends OTP
    pass: process.env.EMAIL_PASSWORD // App password
  },
  family: 4
});

export default transporter;