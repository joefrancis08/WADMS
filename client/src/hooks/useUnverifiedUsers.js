import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsersBy } from "./fetch-react-query/useUsers";
import { deleteUser, updateUserRole } from "../api-calls/Users/userAPI";
import { USER_ROLES } from "../constants/user";
import { TOAST_MESSAGES } from "../constants/messages";
import MODAL_TYPE from "../constants/modalTypes";
import { showErrorToast, showSuccessToast } from "../utils/toastNotification";
import useOutsideClick from "./useOutsideClick";

export const useUnverifiedUsers = () => {
  const navigate = useNavigate();

  const { UU_UPDATE, UU_DELETION } = TOAST_MESSAGES;
  const { UU } = USER_ROLES;
  const { 
    USER_PROFILE,
    UU_VERIFICATION_CONFIRMATION,
    UU_UPDATE: UPDATE_UU,
    UU_DELETION_CONFIRMATION,
  } = MODAL_TYPE;

  const unverifiedUsers = useUsersBy('role', UU).users.data ?? [];

  console.log(unverifiedUsers);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState(UU);

  useOutsideClick('Unverified Users');

  const handleCloseModal = (options = {}) => {
    setModalType(null);
    setSelectedUser(null);
    setSelectedRole(UU);

    if (options.clearDropdown) setShowDropdown(false);
  };

  const handleRowClick = (e, user) => {
    e.stopPropagation();
    setModalType(USER_PROFILE);
    setSelectedUser(user);
  }

  const handleVerifyClick = (e, options = {}) => {
    e.stopPropagation();
    setModalType(UU_VERIFICATION_CONFIRMATION);

    if (options.selectedUser) setSelectedUser(options.selectedUser);
  };

  const handleVerifyConfirm = () => {
    setModalType(UPDATE_UU);
  };

  const handleDropdown = () => {
    showDropdown ? setShowDropdown(false) : setShowDropdown(true);
  }

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowDropdown(false);
  }

  const handleDeleteClick = (e, data = {}) => {
    e.stopPropagation();
    setModalType(UU_DELETION_CONFIRMATION);

    if (data.selectedUser) setSelectedUser(data.selectedUser);
  };

  const handleDeleteConfirm = () => {
    handleDelete();
    setModalType(null);
  };

  const handleDelete = async () => {

    try {
      const res = await deleteUser(selectedUser?.user_uuid);

      if (res.data.success) {
        showSuccessToast(UU_DELETION.SUCCESS);
      } 

    } catch (error) {
      console.error('Failed to delete user:', error);
      showErrorToast(UU_DELETION.ERROR);
    }
  }

  const handleUpdateSubmit = async () => {
    try {
      const res = await updateUserRole(selectedUser.user_uuid, selectedRole);
      res.success && showSuccessToast(UU_UPDATE.SUCCESS);

    } catch (error) {
      console.error('Failed to update user:', error);
      showErrorToast(UU_UPDATE.ERROR);
    }
  }

  const handleSaveUpdate = () => {
     handleUpdateSubmit();
     setSelectedRole(UU);
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