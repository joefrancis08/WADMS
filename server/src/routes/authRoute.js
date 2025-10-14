import express from 'express';
import verifyOTP from '../controllers/auth/POST/verifyOTP.js';
import googleAuth from '../controllers/auth/POST/googleAuth.js';

const authRouter = express.Router();

authRouter.post('/verify-otp', verifyOTP);
authRouter.post('/google', googleAuth);

export default authRouter;

