import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsersBy } from "./useUsers";
import { deleteUser, updateUserRole } from "../api/Users/userAPI";
import { USER_ROLES } from "../constants/user";
import { TOAST_MESSAGES } from "../constants/messages";
import MODAL_TYPE from "../constants/modalTypes";
import { showErrorToast, showSuccessToast } from "../utils/toastNotification";

export const useUnverifiedUsers = () => {
  const navigate = useNavigate();

  const { USER_UPDATE, USER_DELETION } = TOAST_MESSAGES;
  const { UNVERIFIED_USER } = USER_ROLES;
  const { 
    USER_PROFILE,
    USER_VERIFICATION_CONFIRMATION,
    UPDATE_USER,
    USER_DELETION_CONFIRMATION,
  } = MODAL_TYPE;

  const unverifiedUsers = useUsersBy('role', UNVERIFIED_USER).users.data ?? [];
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState(UNVERIFIED_USER);

  const handleCloseModal = (options = {}) => {
    setModalType(null);
    setSelectedUser(null);
    setSelectedRole(UNVERIFIED_USER);

    if (options.clearDropdown) setShowDropdown(false);
  };

  const handleRowClick = (user) => {
    setModalType(USER_PROFILE);
    setSelectedUser(user);
  }

  const handleVerifyClick = (e, options = {}) => {
    e.stopPropagation();
    setModalType(USER_VERIFICATION_CONFIRMATION);

    if (options.selectedUser) setSelectedUser(options.selectedUser);
  };

  const handleVerifyConfirm = () => {
    setModalType(UPDATE_USER);
  };

  const handleDropdown = () => {
    showDropdown ? setShowDropdown(false) : setShowDropdown(true);
  }

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowDropdown(false);
  }

  const handleDeleteClick = (e, options = {}) => {
    e.stopPropagation();
    setModalType(USER_DELETION_CONFIRMATION);

    if (options.selectedUser) setSelectedUser(options.selectedUser);
  };

  const handleDeleteConfirm = () => {
    handleDelete();
    setModalType(null);
  };

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

  const handleSaveUpdate = () => {
     handleUpdateSubmit();
     setSelectedRole(UNVERIFIED_USER);
     setModalType(null);
  }

  return {
    navigation: {navigate},
    user: {selectedUser, selectedRole},
    modal: {modalType},
    ui: {showDropdown},
    data: {unverifiedUsers, USER_ROLES},
    actions: {
      closeModal: {
        handleCloseModal
      },

      row: {
        handleRowClick
      },

      verify: {
        handleVerifyClick,
        handleVerifyConfirm
      },

      dropdown: {
        handleDropdown
      },

      select: {
        handleRoleSelection
      },

      delete: {
        handleDeleteClick,
        handleDeleteConfirm,
      },

      update: {
        handleSaveUpdate,
      },
    }
  };
};