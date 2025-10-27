import { useNavigate, useParams } from "react-router-dom";
import { useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchProgramAreas from "../fetch-react-query/useFetchProgramAreas";
import { useMemo, useState } from "react";
import PATH from "../../constants/path";
import usePageTitle from "../usePageTitle";
import useFetchAssignmentsByUserId from "../fetch-react-query/useFetchAssignmentsByUserId";
import { useAuth } from "../../contexts/AuthContext";
import { useUsersBy } from "../fetch-react-query/useUsers";
import { USER_ROLES } from "../../constants/user";
import useFetchAssignments from "../fetch-react-query/useFetchAssignments";
import MODAL_TYPE from "../../constants/modalTypes";

const { AREA_PARAMETERS } = PATH.TASK_FORCE;

const useProgramAreas = () => {
  const { user } = useAuth();
  const navigate =  useNavigate();
  const { programUUID } = useParams();
  const accredInfoUUID = localStorage.getItem('a_uuid');
  const level = localStorage.getItem('a_level');

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

  const { 
    areas, 
    loading, 
    error 
  } = useFetchProgramAreas({ title, year, accredBody, level, program });
  const areasData = useMemo(() => areas?.data ?? [], [areas?.data]);

  console.log({ areasData });

  usePageTitle('Areas');

  const {
    users: taskForce,
    loading: loadingTaskForce,
    error: errorTaskForce,
    refetch: refetchTaskForce
  } = useUsersBy({ role: [USER_ROLES.TASK_FORCE_CHAIR, USER_ROLES.TASK_FORCE_MEMBER]});

  const {
    assignments,
    loading: loadingAssignments,
    error: errorAssignments,
    refetch: refetchAssignments
  } = useFetchAssignments({ accredInfoId, levelId, programId });
  const assignmentData = useMemo(() => assignments?.assignmentData, [assignments?.assignmentData]);

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});

  const handleAreaCardClick = (areaUUID) => {
    console.log(areaUUID);
    localStorage.setItem('a_p_uuid', programUUID);
    navigate(AREA_PARAMETERS(areaUUID));
  };

  const handleCloseModal = () => {
    setModalData({});
    setModalType(null);
  };

  const handleProfileStackClick = (e, data = {}) => {
    e.stopPropagation();
    const { 
      accredInfoId, levelId, programId, 
      areaId, area, taskForces 
    } = data;
    setModalType(MODAL_TYPE.VIEW_ASSIGNED_TASK_FORCE);
    setModalData({
      accredInfoId,
      levelId,
      programId,
      areaId,
      area,
      taskForces
    });
  };

  console.log(assignmentData);

  return {
    navigate,
    params: { programUUID },
    refs: {},
    states: {
      loading,
      error,
      modalType
    },
    datas: {
      user,
      accredInfoId,
      accredInfoUUID,
      title,
      year, 
      accredBody,
      levelId,
      level,
      programId,
      program,
      areas: areasData,
      taskForce,
      assignmentData,
      modalData
    },
    helpers: {},
    handlers: {
      handleAreaCardClick,
      handleCloseModal,
      handleProfileStackClick
    }
  }
};

export default useProgramAreas;