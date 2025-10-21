import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsersBy } from "./fetch-react-query/useUsers";
import { deleteUser, updateUserRole } from "../api-calls/users/userAPI";
import { USER_ROLES } from "../constants/user";
import { TOAST_MESSAGES } from "../constants/messages";
import MODAL_TYPE from "../constants/modalTypes";
import { showErrorToast, showSuccessToast } from "../utils/toastNotification";
import useOutsideClick from "./useOutsideClick";
import usePageTitle from "./usePageTitle";
import useAutoFocus from "./useAutoFocus";

const { UU_UPDATE, UU_VERIFICATION, UU_DELETION } = TOAST_MESSAGES;
const { UU } = USER_ROLES;
const { 
  UU_PROFILE,
  UU_VERIFICATION_CONFIRMATION,
  UU_UPDATE: UPDATE_UU,
  UU_DELETION_CONFIRMATION,
} = MODAL_TYPE;

export const useUnverifiedUsers = () => {
  const navigate = useNavigate();
  const roleInputRef = useRef();
  const roleDropdownRef = useRef();
  const {users: unverifiedUsers, loading, error, refetch} = useUsersBy({ role: UU }) ?? [];

  console.log(unverifiedUsers);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [modalData, setModalData] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState(UU);

  usePageTitle('Unverified Users');

  useOutsideClick(roleDropdownRef, () => setShowDropdown(false));

  const handleCloseModal = (options = {}) => {
    setModalType(null);
    setSelectedUser(null);
    setSelectedRole(UU);

    if (options.clearDropdown) setShowDropdown(false);
    if (options.from.profileCard) setShowProfile(false);
  };

  const handleRowClick = (e, user) => {
    console.log('click');
    e.stopPropagation();
    setModalType(UU_PROFILE);
    setSelectedUser(user);
    setShowProfile(true);
  }

  const handleVerifyClick = (e, options = {}) => {
    e.stopPropagation();
    console.log(options);
    console.log('Verify click!');
    setModalType(UPDATE_UU);
    setShowDropdown(true);

    options.selectedUser && setSelectedUser(options.selectedUser);
    options.from.profileCard && setShowProfile(true);
  };

  const handleDropdown = () => {
    showDropdown ? setShowDropdown(false) : setShowDropdown(true);
  }

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowDropdown(false);
  };

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

      setModalType(null);

    } catch (error) {
      console.error('Failed to delete user:', error);
      showErrorToast(UU_DELETION.ERROR);
    }
  };

  const handleUpdateRole = () => {
    setModalType(UU_VERIFICATION_CONFIRMATION);
    setModalData({
      selectedUser,
      selectedRole
    });
  };

  const handleConfirmVerification = async () => {
    try {
      const res = await updateUserRole(selectedUser.user_uuid, selectedRole);
      console.log(res);
      if (res.data.success) {
        showSuccessToast(UU_VERIFICATION.SUCCESS);
      }

      setSelectedRole(UU);
      setModalType(null);
      setModalData({});

    } catch (error) {
      console.error('Failed to update user:', error);
      showErrorToast(UU_UPDATE.ERROR);
    }
  }

  return {
    navigate,
    refs: {
      roleDropdownRef
    },
    datas: {
      selectedUser,
      selectedRole,
      modalType,
      modalData,
      showDropdown,
      showProfile,
      unverifiedUsers
    },

    handlers: {
      handleCloseModal, 
      handleRowClick,
      handleVerifyClick,
      handleDropdown,
      handleRoleSelection,
      handleUpdateRole,
      handleDeleteClick,
      handleDeleteConfirm,
      handleConfirmVerification,
    }
  };
};