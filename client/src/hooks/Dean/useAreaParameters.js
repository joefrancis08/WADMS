import { useNavigate, useParams } from "react-router-dom";
import { TOAST_MESSAGES } from "../../constants/messages";
import PATH from "../../constants/path";
import formatProgramParams from "../../utils/formatProgramParams";
import { useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchAreaParameters from "../fetch-react-query/useFetchAreaParameters";
import { useEffect, useRef, useState } from "react";
import useAutoFocus from "../useAutoFocus";
import MODAL_TYPE from "../../constants/modalTypes";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { addAreaParameters, addAssignment, deleteAPM, deleteAssignment } from "../../api-calls/accreditation/accreditationAPI";
import useOutsideClick from "../useOutsideClick";
import { useUsersBy } from "../fetch-react-query/useUsers";
import usePageTitle from "../usePageTitle";
import { getFullNameById } from "../../utils/getUserInfo";
import useFetchAssignments from "../fetch-react-query/useFetchAssignments";
import { USER_ROLES } from "../../constants/user";
import useFetchParamByAreaId from "../fetch-react-query/useFetchParamByAreaId";
import useFetchParameterProgress from "../fetch-react-query/fetchParameterProgress";

const { PARAMETER_ADDITION, ASSIGNMENT } = TOAST_MESSAGES;

const useAreaParameters = () => {
  const paramOptionRef = useRef();
  const assignedTaskForceRef = useRef();
  const { accredInfoUUID, level, programUUID, areaUUID } = useParams();
  const { level: levelName } = formatProgramParams(level);
  const navigate = useNavigate();

  const {
    accredInfoId, 
    title,
    year,
    accredBody,
    levelId,
    programId,
    program 
  } = useProgramToBeAccreditedDetails(accredInfoUUID, programUUID);
  console.log({ title, year, accredBody, levelName, program, areaUUID })

  const { areaId, area } = useProgramAreaDetails({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    areaUUID
  });
  console.log(area);

  const {
    paramsByAreaId,
    loadingParam,
    errorParam,
    refetchParam
  } = useFetchParamByAreaId(areaId);

  const { parameters, loading, error, refetch } = useFetchAreaParameters({
    title, 
    year, 
    accredBody,
    level: levelName, 
    program, 
    area
  }, !!area);

  const { 
    assignments, 
    loading: loadingAssignments, 
    error: errorAssignments,
    refetch: refetchAssignments 
  } = useFetchAssignments({ accredInfoId, levelId, programId, areaId });

  const { 
    paramProgressData, loadingParamProgress, errorParamProgress, refetchParamProgress 
  } = useFetchParameterProgress(areaId);

  console.log(paramProgressData);
  console.log(assignments.assignmentData);
  const assignmentData = assignments?.assignmentData ?? [];
  const paramProgress = paramProgressData.paramProgressData ?? [];

  console.log(paramProgress);
  
  const { 
    users: taskForce, 
    loading: taskForceLoading, 
    error: taskForceError, 
    refetch: taskForceRefetch 
  } = useUsersBy({ role: [USER_ROLES.TASK_FORCE_CHAIR, USER_ROLES.TASK_FORCE_MEMBER]});

  console.log(taskForce);

  const parameterData = parameters.data ?? [];
  const paramsByAreaIdData = paramsByAreaId?.parameters ?? [];
  console.log(paramsByAreaIdData);
  console.log(paramsByAreaId);

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [parametersArr, setParametersArr] = useState([]);
  const [parameterInput, setParameterInput] = useState('');
  const [duplicateValues, setDuplicateValues] = useState([]);
  const [isEllipsisClick, setIsEllipsisClick] = useState(false);
  const [activeParamId, setActiveParamId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedTaskForce, setSelectedTaskForce] = useState([]); // State for selected checkboxes (ParameterModal)
  const [activeTaskForceId, setActiveTaskForceId] = useState(null);
  const [showConfirmUnassign, setShowConfirmUnassign] = useState(false);

  // Auto-focus parameter input
  const parameterInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_PARAMETER
  );

  // Remove duplicate automatically if parameter state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => parametersArr.includes(val)));
  }, [parametersArr]);

  useEffect(() => {
    const modalType = localStorage.getItem('modal-type');
    const modalData = localStorage.getItem('modal-data');
    setModalData(JSON.parse(modalData));
    setModalType(JSON.parse(modalType));
  }, []);

  useOutsideClick(paramOptionRef, () => setActiveParamId(null));

  // Reuse useOutsideClick hook to make assigned task force options disappear
  useOutsideClick(assignedTaskForceRef, () => setActiveTaskForceId(null));

  usePageTitle('Parameters');

  const findDuplicate = (value) => {
    return parameterData.some(d => d.parameter.trim() === value.trim());
  };

  const handlePlusClick = () => {
    setModalType(MODAL_TYPE.ADD_PARAMETER);
  };

  const handleCloseModal = (from = {}) => {
    const { 
      addParam, deleteParam, assignTaskForce, 
      confirmUnassign, viewAssignedTaskForce 
    } = from;
    
    if (addParam || deleteParam) {
      setParametersArr([]);
      setModalType(null);
      setModalData({});

    } else if (assignTaskForce) {
      setSelectedTaskForce([]);
      setModalType(null);
      setModalData({});

    } else if (viewAssignedTaskForce) {
      setModalData(null);
      setModalType(null);

    } else if (confirmUnassign) {
      setShowConfirmUnassign(false);
    }
  };

  const handleParameterChange = (e) => {
    setParameterInput(e.target.value);
  };

  const handleAddParameterValue = (val) => {
    if (findDuplicate(val)) {
      setDuplicateValues(prev => [...new Set([...prev, val])]);
      showErrorToast(`${val} already exist.`, 'top-center');
      return;
    }
    setParametersArr([...parametersArr, val]);
    setDuplicateValues(prev => prev.filter(v => v !== val));
  };

  const handleRemoveParameterValue = (index) => {
    const removedVal = parametersArr[index];
    setParametersArr(parametersArr.filter((_, i) => i !== index));
    setDuplicateValues(prev => prev.filter(v => v !== removedVal));
  };

  const handleSaveParameters = async () => {
    try {
      const res = await addAreaParameters({
        title,
        year,
        accredBody,
        level: levelName,
        program,
        area,
        parameterNames: parametersArr
      });

      if (res.data.success) {
        showSuccessToast(PARAMETER_ADDITION.SUCCESS);
        await refetch();
      }

      handleCloseModal({ addParam: true });

    } catch (error) {
      const duplicateValue = error?.response?.data?.error?.duplicateValue;
      setDuplicateValues(prev => [...new Set([...prev, duplicateValue])]);
      showErrorToast(`${duplicateValue} already exist.`, 'top-center');
      console.log(error);
    }
  };

  const handleEllipsisClick = (e) => {
    e.stopPropagation();
    setIsEllipsisClick(!isEllipsisClick);
  };

  const handleParamOptionClick = (e, data = {}) => {
    e.stopPropagation();
    setActiveParamId(prev => prev !== data.paramId ? data.paramId : null);
    console.log('Clicked!', data.paramId);
  };

  const handleFileUserClick = (e, data = {}) => {
    e.stopPropagation();
    const { parameterId, parameter } = data;
    setModalType(MODAL_TYPE.ASSIGN_TASK_FORCE);
    setModalData({
      accredInfoId, 
      levelId, 
      programId, 
      areaId, 
      parameterId,
      parameter
    });
  };

  const handleOptionItem = (e, data = {}) => {
    e.stopPropagation();
    const { label, apmId, paramUUID, parameter,  } = data;
    console.log(data);
    setActiveParamId(null);

    if (label === 'View Sub-Parameters') {
      localStorage.removeItem('modal-type');
      localStorage.removeItem('modal-data');
      navigate(PATH.DEAN.PARAM_SUBPARAMS({ 
        accredInfoUUID, 
        level, 
        programUUID, 
        areaUUID, 
        parameterUUID: paramUUID
      }));

    } else if (label === 'Assign Task Force') {
      handleFileUserClick(e, data);

    } else if (label === 'Delete') {
      setModalType(MODAL_TYPE.DELETE_PARAM);
      setModalData({ apmId, parameter });
      setActiveParamId(null);
    }
  };

  const handleConfirmDelete = async (data = {}) => {
    const { id, parameter } = data;

    try {
      const res = await deleteAPM({ id, parameter });

      if (res.data.success) {
        showSuccessToast(res.data.message);
      }

      handleCloseModal({ deleteParam: true });

    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleMouseEnter = (e, id) => {
    e.stopPropagation();
    setHoveredId(id);
  };

  const handleMouseLeave = (e) => {
    e.stopPropagation();
    setHoveredId(null);
  };

  // Toggle single checkbox (ParameterModal)
  const handleCheckboxChange = (userId) => {
    setSelectedTaskForce((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) // Remove if already selected
        : [...prev, userId] // Add if not selected
    );
  };

  // Toggle Select All (ParameterModal)
  const handleSelectAll = () => {
    if (selectedTaskForce.length === taskForce.length) {
      setSelectedTaskForce([]); // Unselect all
    } else {
      setSelectedTaskForce(taskForce.map((user) => user.id)); // select all by id
    }
  };

  // Pass selectedTaskForce to backend on save (ParameterModal)
  const handleAssignTaskForce = async (data = {}) => {
    const { accredInfoId, levelId, programId, areaId, parameterId, parameter } = data;
    const userIDList = selectedTaskForce;
    
    try {
      const res = await addAssignment({
        accredInfoId, 
        levelId, 
        programId, 
        areaId,
        parameterId,
        userIDList
      }, { includeParameter: true });

      console.log(res);
      if (res?.data?.success) {
        showSuccessToast(ASSIGNMENT.SUCCESS);
      }

      handleCloseModal({ assignTaskForce: true });

    } catch (error) {
      const userId = error?.response?.data?.error?.user;
      const user = getFullNameById(taskForce, userId);
      
      if (userId && user) {
        showErrorToast(`${user} is already assigned to ${parameter}.`, 'top-center');

      } else {
        showErrorToast(ASSIGNMENT.ERROR);
      }

      throw error;
    }
  };

  const handleProfileStackClick = (e, data = {}) => {
    e.stopPropagation();
    const { parameterId, parameter, taskForces } = data;
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
    console.log('Profile stack is clicked!')
    console.log(data);
  };

  // For ParameterModal.jsx
  const handleATFEllipsisClick = (data = {}) => {
    const { taskForceId } = data;
    console.log('ellipsis clicked!');
    setActiveTaskForceId(prev => prev === taskForceId ? null : taskForceId);
  };

  // For ParameterModal.jsx
  const handleAddTaskForceClick = () => {
    setModalType(MODAL_TYPE.ASSIGN_TASK_FORCE);
  };

  // For ParameterModal.jsx
  const handleUnassignedAllClick = () => {
    console.log('unassigned all clicked!')
  };

  // For ParameterModal.jsx (Assigned Task Force Options)
  const handleAssignedOptionsClick = (option, data = {}) => {
    if (option.label === 'View Profile') {
      navigate(PATH.DEAN.TASK_FORCE_DETAIL(data.taskForceUUID), {
        state: { from: PATH.DEAN.PROGRAM_AREAS({ accredInfoUUID, level, programUUID }) } 
      });
      localStorage.setItem('modal-type', JSON.stringify(modalType));
      localStorage.setItem('modal-data', JSON.stringify({
        accredInfoId: data.accredInfoId,
        levelId: data.levelId,
        programId: data.programId,
        areaId: data.areaId,
        area: data.area,
        parameter: data.parameter,
        taskForces: data.taskForces
      }));
      
    } else if (option.label === 'Unassign') {
      console.log('Unassigned clicked!');
      setModalData(prev => ({
        ...prev,
        selectedTaskForce: { id: data.taskForceId, fullName: data.taskForce, profilePic: data.taskForceImage }
      }));
      handleUnassignedClick({
        accredInfoId: data.accredInfoId,
        levelId: data.levelId,
        programId: data.programId,
        areaId: data.areaId,
        area: data.area,
        taskForceId: data.taskForceId,
        taskForce: data.taskForce
      });
      console.log(data);
    } 
  };

  // For ParameterModal.jsx (Assigned Task Force option - Unassigned)
  const handleUnassignedClick = (data = {}) => {
    const {
      accredInfoId, levelId, programId, 
      areaId,  taskForceId
    } = data;
   setShowConfirmUnassign(true);

    return { 
      accredInfoId, levelId, programId, areaId, taskForceId 
    };
  };

  const handleConfirmUnassign = async (data = {}) => {
    const { 
      accredInfoId, levelId, programId, 
      areaId, parameterId, taskForceId 
    } = data;

    console.log({ accredInfoId, levelId, programId, 
      areaId, taskForceId });

    try {
      const res = await deleteAssignment({
        accredInfoId, levelId, programId,
        areaId, parameterId, taskForceId
      });

      console.log(res);

      handleCloseModal({ confirmUnassign: true });
      setModalData(prev => ({
        ...prev,
        taskForces: modalData.taskForces.filter(tf => tf.id !== taskForceId)
      }));

      if (res.data.success) {
        showSuccessToast(TOAST_MESSAGES.UNASSIGN.SUCCESS);
      }

    } catch (error) {
      showErrorToast(TOAST_MESSAGES.UNASSIGN.ERROR);
      console.error('Error deleting assigment:', error);
      throw error;
    }
  };

  return {
    params: {
      accredInfoUUID,
      level,
      programUUID,
      areaUUID,
      paramOptionRef
    },

    navigation: {
      navigate
    },

    refs: {
      parameterInputRef,
      assignedTaskForceRef
    },

    modals: {
      modalType,
      modalData
    },

    inputs: {
      parameterInput
    },

    datas: {
      title,
      year,
      levelName,
      program,
      area,
      parameters,
      loading,
      error,
      parameterData,
      paramsByAreaIdData,
      parametersArr,
      duplicateValues,
      isEllipsisClick,
      activeParamId,
      hoveredId,
      taskForce,
      taskForceLoading,
      taskForceError,
      taskForceRefetch,
      selectedTaskForce,
      assignmentData,
      activeTaskForceId,
      showConfirmUnassign,
      paramProgress,
      loadingParamProgress,
      errorParamProgress
    },

    handlers: {
      handleCloseModal,
      handlePlusClick,
      handleParameterChange,
      handleAddParameterValue,
      handleRemoveParameterValue,
      handleSaveParameters,
      handleEllipsisClick,
      handleParamOptionClick,
      handleOptionItem,
      handleConfirmDelete,
      handleMouseEnter,
      handleMouseLeave,
      handleCheckboxChange,
      handleSelectAll,
      handleAssignTaskForce,
      handleFileUserClick,
      handleProfileStackClick,
      handleATFEllipsisClick,
      handleAddTaskForceClick,
      handleUnassignedAllClick,
      handleAssignedOptionsClick,
      handleConfirmUnassign
    }
  }
};

export default useAreaParameters;