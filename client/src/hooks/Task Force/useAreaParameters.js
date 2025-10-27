import { useNavigate, useParams } from "react-router-dom";
import { useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchAreaParameters from "../fetch-react-query/useFetchAreaParameters";
import PATH from "../../constants/path";
import useFetchAssignments from "../fetch-react-query/useFetchAssignments";
import { useMemo, useState } from "react";
import { useUsersBy } from "../fetch-react-query/useUsers";
import { USER_ROLES } from "../../constants/user";
import MODAL_TYPE from "../../constants/modalTypes";
import { useAuth } from "../../contexts/AuthContext";

const { PARAM_SUBPARAMS } = PATH.TASK_FORCE;

const useAreaParameters = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { areaUUID } = useParams();
  const accredInfoUUID = localStorage.getItem('a_uuid');
  const level = localStorage.getItem('a_level');
  const programUUID = localStorage.getItem('a_p_uuid');

  console.log(user);
  
  const {
    accredInfoId,
    title,
    year,
    accredBody,
    levelId,
    programId,
    program,
    programObj,
  } = useProgramToBeAccreditedDetails(accredInfoUUID, programUUID);

  const { areaId, area, areaObj, } = useProgramAreaDetails({
    title,
    year,
    accredBody,
    level,
    program,
    areaUUID
  });

  const { parameters, loading, error, refetch } = useFetchAreaParameters({
    title,
    year,
    accredBody,
    level,
    program,
    area
  });
  const parametersData = parameters?.data ?? [];

  const {
    users: taskForceData,
    loading: loadingTaskForce,
    error: errorTaskForce,
    refetch: refetchTaskForce
  } = useUsersBy({ role: [USER_ROLES.TASK_FORCE_CHAIR, USER_ROLES.TASK_FORCE_MEMBER]});

  const {
    assignments, loading: loadingAssignments,
    error: errorAssignments, refetch: refetchAssignments
  } = useFetchAssignments({ accredInfoId, levelId, programId, areaId });
  const assignmentData = useMemo(() => assignments?.assignmentData ?? [], [assignments?.assignmentData]);

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});

  const handleParamCardClick = (parameterUUID) => {
    console.log(parameterUUID);
    localStorage.setItem('a_a_uuid', areaUUID);
    navigate(PARAM_SUBPARAMS(parameterUUID));
  };

  const handleCloseModal = () => {
    setModalType(null);
    setModalData({});
  };

  const handleProfileStackClick = (e, data = {}) => {
    e.stopPropagation();
    const { 
      accredInfoId, levelId, programId, 
      areaId, parameterId, parameter, taskForces 
    } = data;
    setModalType(MODAL_TYPE.VIEW_ASSIGNED_TASK_FORCE);
    setModalData({
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId,
      parameter,
      taskForces
    });
  };

  return {
    navigate,
    refs: {},
    states: {
      loading,  
      error
    },
    datas: {  
      accredInfoId,
      title,
      year,
      accredBody,
      levelId,
      level,
      programId,
      programUUID,
      program,
      areaId,
      area,
      parameters: parametersData,
      taskForceData,
      loadingTaskForce,
      errorTaskForce,
      refetchTaskForce,
      assignmentData,
      loadingAssignments,
      errorAssignments,
      refetchAssignments,
      modalType,
      modalData,
      user
    },
    helpers: {},
    handlers: {  
      handleParamCardClick,
      handleProfileStackClick,
      handleCloseModal
    }
  }
};

export default useAreaParameters;