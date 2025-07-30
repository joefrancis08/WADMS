import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsersByRole } from "./useUsers";
import { deleteUser, updateUserRole } from "../api/Users/userAPI";
import USER_ROLES from "../constants/userRoles";
import { showErrorToast, showSuccessToast } from "../utils/toastNotification";

export const useUnverifiedUsers = () => {
  const navigate = useNavigate();
  const { users } = useUsersByRole(USER_ROLES.DEFAULT);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.DEFAULT);

  const unverifiedUsers = users?.data ?? [];

  const handleDelete = async () => {

    try {
      await deleteUser(selectedUser?.user_uuid);
      showSuccessToast(`${selectedUser?.full_name} deleted successfully!`);

    } catch (error) {
      console.error('Failed to delete user:', error);
      showErrorToast(`Error deleting ${selectedUser?.full_name}. Try again.`);
    }
  }

  const handleUpdateSubmit = async () => {
    try {
      await updateUserRole(selectedUser.user_uuid, selectedRole);
      showSuccessToast(`${selectedUser?.full_name}'s role updated successfully to ${selectedRole}!`);

    } catch (error) {
      console.error('Failed to update user:', error);
      showErrorToast(`Error updating ${selectedUser?.full_name}'s role to ${selectedRole}. Try again.`);
    }
  }

  return {
    navigation: {
      navigate,
    },

    user: {
      selectedUser,
      setSelectedUser,
      selectedRole,
      setSelectedRole,
    },

    modal: {
      modalType,
      setModalType,
    },

    ui: {
      showDropdown,
      setShowDropdown,
    },

    data: {
      unverifiedUsers,
      USER_ROLES,
    },

    actions: {
      handleDelete,
      handleUpdateSubmit,
    }
  };
};