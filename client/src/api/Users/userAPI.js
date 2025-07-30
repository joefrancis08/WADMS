import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserSession = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/session`, { withCredentials: true });
    
    return res.data.user;

  } catch (error) {
    console.log('Error getting user session:', error);
  }
}

export const updateUserRole = async (selectedUserId, newRole) => {
  try {
    const res = await axios.patch(`${API_BASE_URL}/users/${selectedUserId}/role`, {
      role: newRole,
      status: 'Verified'
    });

    return res.data;

  } catch (error) {
    console.log('Error:', error);
  }
}

export const deleteUser = async (selectedUserId) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/users/${selectedUserId}`);

    return res.data;

  } catch (error) {
    console.log('Error deleting user:', error);
  }
}