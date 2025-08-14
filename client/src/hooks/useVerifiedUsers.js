import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { USER_ROLES, USER_STATUS } from "../constants/user";
import PATH from "../constants/path";
import { useUsersBy } from "./useUsers";
import MODAL_TYPES from "../constants/modalTypes";
import { TOAST_MESSAGES } from "../constants/messages";
import { deleteUser, postUser, updateUser } from "../api/Users/userAPI";
import { showErrorToast, showSuccessToast } from "../utils/toastNotification";
import { emailRegex } from "../utils/regEx";

export const useVerifiedUsers = () => {
  const navigate = useNavigate();

  const { ADD_USER, UPDATE_USER, USER_DELETION_CONFIRMATION } = MODAL_TYPES;
  const { VERIFIED_USERS, VERIFIED_USER_DETAIL } = PATH.ADMIN;
  const { VERIFIED_USER_ADDITION, VERIFIED_USER_UPDATE, VERIFIED_USER_DELETION } = TOAST_MESSAGES;
  const { UNVERIFIED_USER } = USER_ROLES;
  const { VERIFIED } = USER_STATUS;
  
  
  const unverifiedUsers = useUsersBy('role', UNVERIFIED_USER).users;
  const [unverifiedUserCount, setUnverifiedUserCount] = useState(0);
  const { users, loading, error } = useUsersBy('status', VERIFIED);
  const verifiedUsers = users.data ?? [];
  
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [infoClick, setInfoClick] = useState(false);
  const [formValue, setFormValue] = useState({
    fullName: '',
    email: '',
    role: ''
  });
  const [updatedValue, setUpdatedValue] = useState({
    fullName: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    if(selectedUser) {
      setUpdatedValue({
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
      selectedUser?.full_name.trim() === updatedValue.fullName.trim() && 
      selectedUser?.email.trim() === updatedValue.email.trim() && 
      selectedUser?.role.trim() === updatedValue.role.trim();

    const anyEmpty = 
      updatedValue.fullName.trim() === '' ||
      updatedValue.email.trim() === '';

    const invalidEmail = !emailRegex.test(updatedValue.email);

    return unchanged || anyEmpty || invalidEmail;
  }, [selectedUser, updatedValue]);

  const handleAddUser = () => {
    setModalType(ADD_USER);
  };

  const handleAddUserInputChange = (e) => {
    setFormValue(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleInfoClick = () => {
    setInfoClick(!infoClick);
  }

  const handleSaveAdded =  async () => {
    try {
      const res = await postUser({
        fullName: formValue.fullName,
        email: formValue.email,
        role: formValue.role,
        password: `${formValue.fullName}0@wdms`
      });
      const emailAlreadyExists = res?.data?.alreadyExist;
      res?.data?.success && showSuccessToast(VERIFIED_USER_ADDITION.SUCCESS);

    } catch (error) {
      console.error(error);
      showErrorToast(VERIFIED_USER_ADDITION.ERROR);
    }

    handleCloseModal({untoggleDropdown: true, clearForm: true});
  };

  const handleChange = (e) => {
    setUpdatedValue(prev => ({...prev, [e.target.name]: e.target.value}));
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
      setActiveDropdownId(null);
    }
  };

  const handleUpdate = (e, selectedUser) => {
    e.stopPropagation();

    setSelectedUser(selectedUser);
    setModalType(UPDATE_USER);
  };

  const handleSaveUpdate = async () => {
    const { fullName, email, role } = updatedValue;

    try {
      const res = await updateUser(fullName, email, role, selectedUser?.user_uuid);

      res.success && showSuccessToast(VERIFIED_USER_UPDATE.SUCCESS);

    } catch (error) {
      console.log('Error updating user: ', error)
    }

    handleCloseModal({removeSelectedUser: true});
  };

  const handleDelete = (e, selectedUser) => {
    e.stopPropagation();

    setSelectedUser(selectedUser);
    setModalType(USER_DELETION_CONFIRMATION);
  };

  const handleConfirmDelete = async (selectedUserId, options = {}) => {
    try {
      const res = await deleteUser(selectedUserId);
      res.success && showSuccessToast(VERIFIED_USER_DELETION.SUCCESS);

    } catch (error) {
      console.error('Error deleting user: ', error);
      showErrorToast(VERIFIED_USER_DELETION.ERROR);
    }

    options.navigateBack && navigate(VERIFIED_USERS);

    handleCloseModal({removeActiveDropdownId: true, removeSelectedUser: true});
  };

  const handleCloseModal = (options = {}) => {
    setModalType(null);
    setInfoClick(false);

    options.removeSelectedUser && setSelectedUser(null);
    options.untoggleDropdown && setToggleDropdown(false);
    options.removeActiveDropdownId && setActiveDropdownId(null);
    options.clearForm && setFormValue({
      fullName: '',
      email: '',
      role: ''
    });
  };

  const handleChevronClick = () => {
    setToggleDropdown(!toggleDropdown);
  };

  const handleDropdownMenuClick = (role, options = {}) => {
    setToggleDropdown(false);

    options.isForAddUser && setFormValue(prev => ({...prev, role}));
    options.isForUpdateUser && setUpdatedValue(prev => ({...prev, role}));
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
      updatedValue,
      handleChange,
    },

    info: {
      infoClick,
      handleInfoClick
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

    userAdd: {
      formValue,
      handleAddUser,
      handleAddUserInputChange,
      handleSaveAdded
    },

    userDelete: {
      handleDelete
    },

    userUpdate: {
      handleUpdate,
      handleSaveUpdate
    },

    userCount: {
      unverifiedUserCount
    }
  };
};
