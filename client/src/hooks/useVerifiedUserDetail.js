import { useState, useEffect, useMemo} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import PATH from "../constants/path";
import { USER_STATUS } from "../constants/user";
import MODAL_TYPES from '../constants/modalTypes';
import { useUsersBy } from "./useUsers";

const useVerifiedUserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { TASK_FORCE } = PATH.DEAN;
  const { NOT_FOUND_URL } = PATH.PUBLIC;
  const { VERIFIED } = USER_STATUS;
  const { USER_DELETION_CONFIRMATION } = MODAL_TYPES;
  const { users, loading } = useUsersBy('status', VERIFIED);
  const verifiedUsers = useMemo(() => users.data ?? [], [users.data]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    if (!loading && verifiedUsers.length > 0) {
      const matchedUser = verifiedUsers.find(u => String(u.user_uuid) === String(id));
      if (isMounted) setSelectedUser(matchedUser);
      if (!matchedUser && isMounted) navigate(NOT_FOUND_URL);
    }
    return () => { isMounted = false; };
  }, [id, verifiedUsers, NOT_FOUND_URL, navigate, loading]);

  const handleDelete = (e) => {
    e.stopPropagation();
    setModalType(USER_DELETION_CONFIRMATION);
    console.log('You click delete.')
  }

  return {
    actions: {
      handleDelete
    },

    constant: {
      TASK_FORCE
    }, 

    data: {
      selectedUser,
      verifiedUsers
    }, 

    param: {
      id
    },

    state: {
      loading,
      modalType
    }

    
  }
};

export default useVerifiedUserDetail;