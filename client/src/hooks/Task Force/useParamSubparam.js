import { useNavigate, useParams } from "react-router-dom";
import { useAreaParamsDetails, useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchParamSubparam from "../fetch-react-query/useFetchParamSubparam";
import { useMemo, useState } from "react";
import PATH from "../../constants/path";
import { useAuth } from "../../contexts/AuthContext";
import { useUsersBy } from "../fetch-react-query/useUsers";
import { USER_ROLES } from "../../constants/user";
import MODAL_TYPE from "../../constants/modalTypes";
import useFetchAssignments from "../fetch-react-query/useFetchAssignments";

const useParamSubparam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { paramUUID } = useParams();
  const accredInfoUUID = localStorage.getItem('a_uuid');
  const level = localStorage.getItem('a_level');
  const programUUID = localStorage.getItem('a_p_uuid');
  const areaUUID = localStorage.getItem('a_a_uuid');

  const {
    accredInfoId, title, year, accredBody,
    levelId, programId, program, programObj,
  } = useProgramToBeAccreditedDetails(accredInfoUUID, programUUID);

  const { areaId, area, areaObj, } = useProgramAreaDetails({
    title, year, accredBody, level,
    program, areaUUID
  });

  const { paramId, paramName, paramObj } = useAreaParamsDetails({
    title, year, accredBody, level, program,
    area, parameterUUID: paramUUID
  });

  const { subParameters, loading, error, refetch } = useFetchParamSubparam({ 
    title, year, accredBody, level,
    program, area, parameter: paramName
  });
  const subParametersData = useMemo(() => subParameters?.data ?? [], [subParameters?.data]);

  const {
      users: taskForceData, loading: loadingTaskForce,
      error: errorTaskForce, refetch: refetchTaskForce
  } = useUsersBy({ role: [USER_ROLES.TASK_FORCE_CHAIR, USER_ROLES.TASK_FORCE_MEMBER]});

  const {
    assignments, loading: loadingAssignments,
    error: errorAssignments, refetch: refetchAssignments
  } = useFetchAssignments({ accredInfoId, levelId, programId, areaId });
  const assignmentData = useMemo(() => assignments?.assignmentData ?? [], [assignments?.assignmentData]);
  
  // Modal States
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  
  const handleSubParamCardClick = (subParamUUID) => {
    localStorage.setItem('a_pa_uuid', paramUUID);
    navigate(PATH.TASK_FORCE.SUBPARAM_INDICATORS(subParamUUID))
  };

  const handleCloseModal = () => {
    setModalType(null);
    setModalData({});
  };

  const handleProfileStackClick = (e, data = {}) => {
    e.stopPropagation();
    const { 
      accredInfoId, levelId, programId, 
      areaId, parameterId, subParameter, taskForces 
    } = data;
    setModalType(MODAL_TYPE.VIEW_ASSIGNED_TASK_FORCE);
    setModalData({
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId,
      subParameter,
      taskForces
    });
  };

  return {
    navigate,
    datas: {
      accredInfoId, accredInfoUUID, title,
      year, accredBody, levelId, level,
      programId, programUUID, program,
      areaId, areaUUID, area,
      paramId, paramUUID, paramName, 
      subParametersData, modalType,
      modalData, taskForceData,
      assignmentData, user
    },
    handlers: {
      handleSubParamCardClick,
      handleCloseModal,
      handleProfileStackClick
    }
  };
};

export default useParamSubparam;