import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsersByRole } from "./useUsers";
import { deleteUser, updateUserRole } from "../api/Users/userAPI";
import { USER_ROLES } from "../constants/user";
import { TOAST_MESSAGES } from "../constants/messages";
import { showErrorToast, showSuccessToast } from "../utils/toastNotification";

const { USER_UPDATE, USER_DELETION } = TOAST_MESSAGES;

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
      showSuccessToast(USER_DELETION.SUCCESS);

    } catch (error) {
      console.error('Failed to delete user:', error);
      showErrorToast(USER_DELETION.ERROR);
    }
  }

  const handleUpdateSubmit = async () => {
    try {
      await updateUserRole(selectedUser.user_uuid, selectedRole);
      showSuccessToast(USER_UPDATE.SUCCESS);

    } catch (error) {
      console.error('Failed to update user:', error);
      showErrorToast(USER_UPDATE.ERROR);
    }
  }

  return {
    navigation: {navigate},
    user: {selectedUser, setSelectedUser, selectedRole, setSelectedRole},
    modal: {modalType, setModalType},
    ui: {showDropdown, setShowDropdown},
    data: {unverifiedUsers, USER_ROLES},
    actions: {handleDelete, handleUpdateSubmit}
  };
};