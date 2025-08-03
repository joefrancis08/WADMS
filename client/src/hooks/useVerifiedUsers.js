import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { USER_ROLES, USER_STATUS } from "../constants/user";
import PATH from "../constants/path";
import { useUsersBy } from "./useUsers";
import MODAL_TYPES from "../constants/modalTypes";


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

  useEffect(() => {
  // Only run this if users is an array (not loading or error)
  if (Array.isArray(unverifiedUsers?.data)) {
      const count = unverifiedUsers.data.length;
      setUnverifiedUserCount(count);
    }
  }, [unverifiedUsers]);

  const handleEllipsisClick = (e, user) => {
    e.stopPropagation();
    setActiveDropdownId(prev => prev === user.id ? null : user.id);
  }

  const handleDropdownMenu = (e, menu, user) => {
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

  console.log(selectedUser);
  console.log(modalType);

  return {
    data: {
      unverifiedUsers,
      verifiedUsers
    },

    dropdown: {
      activeDropdownId,
      setActiveDropdownId,
      handleDropdownMenu,
    },

    ellipsis: {
      handleEllipsisClick
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
