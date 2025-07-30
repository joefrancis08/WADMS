import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const checkUserEmail = async (values) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/check-email`, {email: values?.email});

    return res;

  } catch (error) {
    console.log("There's an error while checking user email: ", error);
  }
}

export const registerUser = async (values) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/users/register`, values, { withCredentials: true });

    return data;

  } catch (error) {
    console.log('Error registering the user: ', error);
  }
}

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