import axios from "axios";

export const updateUserRole = async (selectedUserId, newRole) => {
  try {
    const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/users/${selectedUserId}/role`, {
      role: newRole,
      status: 'Verified'
    });

    return res.data;

  } catch (error) {
    console.log('Error:', error);
  }
}