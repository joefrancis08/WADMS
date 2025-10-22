import axios from "axios";
import apiClient from "../../services/axios/apiClient.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Public Routes (No Token required)
export const confirmEmail = (email) =>
  apiClient.post(`${API_BASE_URL}/users/confirm-email`, { email });

export const verifyToken = (token) =>
  apiClient.post(`${API_BASE_URL}/users/verify-token`, { token }, { withCredentials: true });

export const registerUser = async (values) => {
  try {
    const { data } = await  apiClient.post(`${API_BASE_URL}/users/register`, values, {
      withCredentials: true,
    });
    // data should include { success, user, message, alreadyExists? }
    return data;
  } catch (err) {
    // If server sent a response, surface that; otherwise return a generic shape
    const data = err?.response?.data ?? {
      message: 'Network or unexpected error.',
      success: false,
      user: null,
    };
    return data; // <-- crucial: always return a value
  }
};

export const loginUser = async ({ email, password }) => {
  return  apiClient.post(
    `${API_BASE_URL}/users/login`,
    { email, password },
    { withCredentials: true }
  );
};

export const checkUserEmail = async (email) =>
  apiClient.get(`${API_BASE_URL}/users/check-email`, { params: { email } });

// Authenticated Routes (Token required)
export const postUser = async (data) => {
  try {
    const res = await apiClient.post(`/users/add-user`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  } catch (error) {
    console.log("There's an error while adding user: ", error);
  }
};

export const shareToken = async ({ email, fullName, accessLink }) => {
  console.log(accessLink);
  return apiClient.post(`/users/share-token`, { email, fullName, accessLink });
};

export const logoutUser = async () => {
  return apiClient.post(`/users/logout`, {}, { withCredentials: true });
};

export const getUserSession = async () => {
  try {
    const res = await apiClient.get(`/users/session`, { withCredentials: true });
    return res.data.user;
  } catch (error) {
    console.error("Error getting user session:", error);
    throw error;
  }
};

export const fetchAllUsers = async (controller) => {
  try {
    return await apiClient.get(`/users`, { signal: controller.signal });
  } catch (error) {
    console.error("Error getting all users:", error);
  }
};

export const fetchAccessToken = async ({ signal }) =>
  apiClient.get(`/users/access-token`, { signal });

export const fetchUserBy = async (key, value, controller) => {
  try {
    return await apiClient.get(`/users/by-${key}`, {
      params: { [key]: value },
      signal: controller.signal,
    });
  } catch (error) {
    console.log(`Error fetching user by ${key}:`, error);
  }
};

export const fetchUserStatus = async (email, signal) => {
  return await  apiClient.get(`${API_BASE_URL}/users/fetch-user-status`, {
    params: { email },
    signal
  });
};
 
export const fetchUserAssignments = async (userId, signal) =>
  apiClient.get(`/accreditation/fetch-assignments`, {
    params: { userId },
    signal,
  });

export const updateUser = async (updatedData, uuid) => {
  try {
    return await apiClient.patch(`/users/${uuid}`, updatedData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.log("Error updating data:", error);
    console.log(error.response?.data);
  }
};

export const generateNewToken = (userUUID) => {
  console.log(userUUID);
  return apiClient.patch(`/users/generate-new-token`, { userUUID });
};

export const updateUserRole = async (selectedUserUUID, newRole) =>
  apiClient.patch(`/users/role/${selectedUserUUID}`, {
    role: newRole,
  });

export const updateUserStatus = (uuid, status) => {
  return  apiClient.patch(`${API_BASE_URL}/users/status/${uuid}`, {
    status
  });
}

export const deleteUser = async (uuid) =>
  apiClient.delete(`/users/delete-user`, { params: { uuid } });
