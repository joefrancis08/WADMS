import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const verifyOTP = async (email, otp) => {
  return await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
    email,
    otp
  });
};