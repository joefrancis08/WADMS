import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { USER_ROLES, USER_STATUS } from "../constants/user";
import { useUsersBy } from "./useUsers";


export const useVerifiedUsers = () => {
  const navigate = useNavigate();

  const { UNVERIFIED_USER } = USER_ROLES;
  const { VERIFIED } = USER_STATUS;
  
  const unverifiedUsers = useUsersBy('role', UNVERIFIED_USER).users;
  const [unverifiedUserCount, setUnverifiedUserCount] = useState(0);
  const { users, loading, error } = useUsersBy('status', VERIFIED);
  const verifiedUsers = users.data ?? [];
  
  const [activeDropdownId, setActiveDropdownId] = useState(null);

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

  return {
    navigation: {
      navigate,
    },

    state: {
      loading, 
      error
    },

    userCount: {
      unverifiedUserCount
    },

    ellipsis: {
      handleEllipsisClick
    },

    dropdown: {
      activeDropdownId,
      setActiveDropdownId
    },

    data: {
      unverifiedUsers,
      verifiedUsers
    },

    actions: {

    }
  };
};
