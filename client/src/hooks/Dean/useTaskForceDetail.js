import { useState, useEffect, useMemo} from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PATH from "../../constants/path";
import MODAL_TYPES from '../../constants/modalTypes';
import { useUsersBy } from "../fetch-react-query/useUsers";
import usePageTitle from '../usePageTitle';
import useFetchAssignments from '../fetch-react-query/useFetchAssignments';
import { USER_ROLES } from '../../constants/user';

const useVerifiedUserDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { TASK_FORCE } = PATH.DEAN;
  const { NOT_FOUND_URL } = PATH.PUBLIC;
  const { USER_DELETION_CONFIRMATION } = MODAL_TYPES;
  const { users, loading, error } = useUsersBy({ role: [USER_ROLES.TASK_FORCE_CHAIR, USER_ROLES.TASK_FORCE_MEMBER]});
  const taskForce = useMemo(() => users, [users]);

  const userId = getIdByUuid(taskForce, uuid);
  const { 
    assignments, 
    loading: loadingAssignments,
    error: errorAssignments,
    refetch: refetchAssignments
  } = useFetchAssignments({ userId });

  console.log(taskForce);
  
  const assignmentData = assignments.assignmentData ?? [];
  console.log(assignmentData);

  usePageTitle('Task Force Details');

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
  };

  const handleBack = () => {
    navigate(-1);
  };

  return {
    navigate, 
    params: {
      uuid
    },

    states: {
      loading,
      loadingAssignments,
      errorAssignments
    },

    datas: {
      modalType,
      selectedUser,
      taskForce,
      assignmentData
    },
    
    handlers: {
      handleDelete,
      refetchAssignments,
      handleBack
    },

    constant: {
      TASK_FORCE
    }
  }
};

export default useVerifiedUserDetail;