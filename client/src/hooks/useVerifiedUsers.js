import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { USER_ROLES, USER_STATUS } from "../constants/user";
import PATH from "../constants/path";
import { useUsersBy } from "./useUsers";
import MODAL_TYPES from "../constants/modalTypes";
import { TOAST_MESSAGES } from "../constants/messages";
import { deleteUser, updateUser } from "../api/Users/userAPI";
import { showErrorToast, showSuccessToast } from "../utils/toastNotification";
import { emailRegex } from "../utils/regEx";

export const useVerifiedUsers = () => {
  const navigate = useNavigate();

  const { UPDATE_USER, USER_DELETION_CONFIRMATION } = MODAL_TYPES;
  const { VERIFIED_USER_DETAIL } = PATH.ADMIN;
  const { UNVERIFIED_USER } = USER_ROLES;
  const { VERIFIED } = USER_STATUS;
  const { VERIFIED_USER_UPDATE, VERIFIED_USER_DELETION } = TOAST_MESSAGES;
  
  const unverifiedUsers = useUsersBy('role', UNVERIFIED_USER).users;
  const [unverifiedUserCount, setUnverifiedUserCount] = useState(0);
  const { users, loading, error } = useUsersBy('status', VERIFIED);
  const verifiedUsers = users.data ?? [];
  
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [formValue, setFormValue] = useState({
    fullName: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    if(selectedUser) {
      setFormValue({
        fullName: selectedUser.full_name || '',
        email: selectedUser.email || '',
        role: selectedUser.role || ''
      })
    }
  }, [selectedUser]);

  useEffect(() => {
  // Only run this if users is an array (not loading or error)
  if (Array.isArray(unverifiedUsers?.data)) {
      const count = unverifiedUsers.data.length;
      setUnverifiedUserCount(count);
    }
  }, [unverifiedUsers]);

  const isDisabled = useMemo(() => {
    const unchanged = 
      selectedUser?.full_name.trim() === formValue.fullName.trim() && 
      selectedUser?.email.trim() === formValue.email.trim() && 
      selectedUser?.role.trim() === formValue.role.trim();

    const anyEmpty = 
      formValue.fullName.trim() === '' ||
      formValue.email.trim() === '';

    const invalidEmail = !emailRegex.test(formValue.email);

    return unchanged || anyEmpty || invalidEmail;
  }, [selectedUser, formValue]);

  const handleChange = (e) => {
    setFormValue(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleEllipsisClick = (e, user) => {
    e.stopPropagation();
    setActiveDropdownId(prev => prev === user.id ? null : user.id);
  };

  const handleDropdown = (e, menu, user) => {
    e.stopPropagation();

    if (menu?.label === 'View Details') {
      navigate(VERIFIED_USER_DETAIL(user?.user_uuid));
      setActiveDropdownId(null);

    } else if (menu?.label === 'Update') {
      handleUpdate(e, user);
      setActiveDropdownId(null);

    } else if (menu?.label === 'Delete') {
      handleDelete(e, user);
    }
  };

  const handleUpdate = (e, selectedUser) => {
    e.stopPropagation();

    setSelectedUser(selectedUser);
    setModalType(UPDATE_USER);
  };

  const handleSaveUpdate = async () => {
    const { fullName, email, role } = formValue;

    try {
      const res = await updateUser(fullName, email, role, selectedUser?.user_uuid);

      res.success && showSuccessToast(VERIFIED_USER_UPDATE.SUCCESS);

    } catch (error) {
      console.log('Error updating user: ', error)
    }

    handleCloseModal();
  };

  const handleDelete = (e, selectedUser) => {
    e.stopPropagation();

    setSelectedUser(selectedUser);
    setModalType(USER_DELETION_CONFIRMATION);
  };

  const handleConfirmDelete = async (selectedUserId) => {
    try {
      const res = await deleteUser(selectedUserId);
      res.success && showSuccessToast(VERIFIED_USER_DELETION.SUCCESS);

    } catch (error) {
      console.error('Error deleting user: ', error);
      showErrorToast(VERIFIED_USER_DELETION.ERROR);
    }

    handleCloseModal({removeActiveDropdownId: true});
  };

  const handleCloseModal = (options = {}) => {
    setSelectedUser(null);
    setModalType(null);

    if (options.untoggleDropdown) setToggleDropdown(false);
    if (options.removeActiveDropdownId) setActiveDropdownId(null);
  };

  const handleChevronClick = () => {
    setToggleDropdown(!toggleDropdown);
  };

  const handleDropdownMenuClick = (role) => {
    setFormValue(prev => ({...prev, role}));
    setToggleDropdown(false);
  };

  return {
    chevron: {
      handleChevronClick
    },

    data: {
      unverifiedUsers,
      verifiedUsers
    },

    confirmDelete: {
      handleConfirmDelete
    },

    dropdown: {
      activeDropdownId,
      setActiveDropdownId,
      handleDropdown,
      handleDropdownMenuClick,
      toggleDropdown,
      setToggleDropdown
    },

    ellipsis: {
      handleEllipsisClick
    },

    form: {
      formValue,
      handleChange,
    },

    modal: {
      modalType,
      handleCloseModal
    },

    navigation: {
      navigate,
    },

    saveButton: {
      isDisabled
    },

    state: {
      loading, 
      error
    },

    user: {
      selectedUser
    },

    userDelete: {
      handleDelete
    },

    userUpdate: {
      handleSaveUpdate
    },

    userCount: {
      unverifiedUserCount
    }
  };
};
