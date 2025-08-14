import { useState, useEffect, useMemo} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import PATH from "../constants/path";
import { USER_STATUS } from "../constants/user";
import MODAL_TYPES from '../constants/modalTypes';
import { useUsersBy } from "./useUsers";

const useVerifiedUserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { VERIFIED_USERS } = PATH.DEAN;
  const { NOT_FOUND_URL } = PATH.PUBLIC;
  const { VERIFIED } = USER_STATUS;
  const { UPDATE_USER, USER_DELETION_CONFIRMATION } = MODAL_TYPES;
  const { users, loading } = useUsersBy('status', VERIFIED);
  const verifiedUsers = useMemo(() => users.data ?? [], [users.data]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);

  !loading && !selectedUser && (
    navigate(NOT_FOUND_URL)
  );
  
  useEffect(() => {
    if (!verifiedUsers.length) return;
    const matchedUser = verifiedUsers.find(user => String(user.user_uuid) === String(id));
    setSelectedUser(matchedUser);
  }, [id, verifiedUsers]);

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
      VERIFIED_USERS
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