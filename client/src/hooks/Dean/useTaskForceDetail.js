import { useState, useEffect, useMemo} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import PATH from "../../constants/path";
import MODAL_TYPES from '../../constants/modalTypes';
import { useUsersBy } from "../fetch-react-query/useUsers";
import usePageTitle from '../usePageTitle';
import useFetchAssignments from '../fetch-react-query/useFetchAssignments';

const useVerifiedUserDetail = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { TASK_FORCE } = PATH.DEAN;
  const { NOT_FOUND_URL } = PATH.PUBLIC;
  const { USER_DELETION_CONFIRMATION } = MODAL_TYPES;
  const { users, loading, error } = useUsersBy();
  const taskForce = useMemo(() => users, [users]);

  const userId = getIdByUuid(taskForce, uuid);
  const { 
    assignments, 
    loading: loadingAssignments,
    error: errorAssignments,
    refetch: refetchAssignments
  } = useFetchAssignments(userId);

  console.log(assignments);

  usePageTitle('Task Force Details | WDMS');

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    if (!loading && taskForce.length > 0) {
      const matchedUser = taskForce.find(u => String(u.uuid) === String(uuid));
      if (isMounted) setSelectedUser(matchedUser);
      if (!matchedUser && isMounted) navigate(NOT_FOUND_URL);
    }
    return () => { isMounted = false; };
  }, [uuid, taskForce, NOT_FOUND_URL, navigate, loading]);

  function getIdByUuid(users, paramUuid) {
    const user = users.find(u => u.uuid === paramUuid);
    return user ? user.id : null;
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setModalType(USER_DELETION_CONFIRMATION);
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
      taskForce
    }, 

    param: {
      uuid
    },

    state: {
      loading,
      modalType
    }
  }
};

export default useVerifiedUserDetail;