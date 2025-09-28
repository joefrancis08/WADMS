import express from 'express';
import verifyOTP from '../controllers/auth/POST/verifyOTP.js';

const authRouter = express.Router();

authRouter.post('/verify-otp', verifyOTP);

export default authRouter;

