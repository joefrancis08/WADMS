import apiClient from "../../services/axios/apiClient";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const verifyOTP = async (email, otp) =>
  apiClient.post(`${API_BASE_URL}/auth/verify-otp`, {
    email,
    otp
  });

export const OAuth = async (tokenResponse, mode) =>
  apiClient.post(`${API_BASE_URL}/auth/google`, {
    token: tokenResponse.access_token,
    mode
  }, { withCredentials: true });