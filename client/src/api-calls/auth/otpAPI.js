import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const verifyOTP = async (email, otp) => {
  console.log({ email, otp })
  return await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
    email,
    otp
  });
};

export const OAuth = async (tokenResponse, mode) => {
  return await axios.post(`${API_BASE_URL}/auth/google`, {
    token: tokenResponse.access_token,
    mode
  }, { withCredentials: true })
};