import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { USER_ROLES, USER_STATUS } from "../constants/user";
import PATH from "../constants/path";
import { useUsersBy } from "./useUsers";
import MODAL_TYPES from "../constants/modalTypes";
import Dropdown from "../components/Dropdown/Dropdown";

export const useVerifiedUsers = () => {
  const navigate = useNavigate();

  const { UPDATE_USER } = MODAL_TYPES;
  const { VERIFIED_USER_DETAIL } = PATH.ADMIN;
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
  }, [selectedUser])

  useEffect(() => {
  // Only run this if users is an array (not loading or error)
  if (Array.isArray(unverifiedUsers?.data)) {
      const count = unverifiedUsers.data.length;
      setUnverifiedUserCount(count);
    }
  }, [unverifiedUsers]);

  const handleChange = (e) => {
    setFormValue(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  const handleEllipsisClick = (e, user) => {
    e.stopPropagation();
    setActiveDropdownId(prev => prev === user.id ? null : user.id);
  }

  const handleDropdown = (e, menu, user) => {
    e.stopPropagation();

    if (menu?.label === 'View Details') {
      navigate(VERIFIED_USER_DETAIL(user?.user_uuid));
      setActiveDropdownId(null);
    } else if (menu?.label === 'Update') {
      handleUpdate(e, user);
      setActiveDropdownId(null);
    }
  }

  const handleUpdate = (e, selectedUser) => {
    e.stopPropagation();

    setSelectedUser(selectedUser);
    setModalType(UPDATE_USER);
  }

  const handleSaveUpdate = () => {
    console.log('Update save');
  }

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalType(null);
  }

  const handleChevronClick = () => {
    setToggleDropdown(!toggleDropdown);
  }

  const handleDropdownMenuClick = (role) => {
    setFormValue(prev => ({...prev, role}));
    setToggleDropdown(false);
  }

  return {
    chevron: {
      handleChevronClick
    },

    data: {
      unverifiedUsers,
      verifiedUsers
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

    state: {
      loading, 
      error
    },

    user: {
      selectedUser
    },

    userUpdate: {
      handleSaveUpdate
    },

    userCount: {
      unverifiedUserCount
    }
  };
};
