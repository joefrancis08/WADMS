import { useNavigate, useParams } from "react-router-dom";
import formatProgramParams from "../../utils/formatProgramParams";
import { useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchProgramAreas from "../fetch-react-query/useFetchProgramAreas";
import { useEffect, useRef, useState } from "react";
import MODAL_TYPE from "../../constants/modalTypes";
import useAutoFocus from "../useAutoFocus";
import formatArea from "../../utils/formatArea";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import useOutsideClick from "../useOutsideClick";
import { addAssignment, addProgramAreas, deleteAssignment, deletePAM } from "../../api-calls/accreditation/accreditationAPI";
import { TOAST_MESSAGES } from "../../constants/messages";
import PATH from "../../constants/path";
import useFetchAreasByLevel from "../fetch-react-query/useFetchAreasByLevel";
import { useUsersBy } from "../fetch-react-query/useUsers";
import usePageTitle from "../usePageTitle";
import useFetchAssignments from "../fetch-react-query/useFetchAssignments";
import formatAreaName from "../../utils/formatAreaName";

const { AREA_PARAMETERS } = PATH.DEAN;
const { ASSIGNMENT, UNASSIGN } = TOAST_MESSAGES;

function getFullNameById (dataset, id) {
  const data = dataset.find(d => d.id === id);
  return data ? data.fullName : null;
};

const useProgramAreas = () => {
  const navigate = useNavigate();
  const areaOptionsRef = useRef();
  const assignedTaskForceRef = useRef();
  usePageTitle('Areas');
  const { accredInfoUUID, level, programUUID } = useParams();
  const { level: formattedLevel } = formatProgramParams(level);

  const { areas: areasByLevel } = useFetchAreasByLevel(formattedLevel);

  const { 
    accredInfoId, title, year, accredBody, 
    levelId, programId, program 
  } = useProgramToBeAccreditedDetails(accredInfoUUID, programUUID);

  const { 
    assignments, 
    loading: loadingAssignments, 
    error: errorAssignments,
    refetch: refetchAssignments 
  } = useFetchAssignments({ accredInfoId, levelId, programId });
  console.log(assignments.assignmentData);
  const assignmentData = assignments?.assignmentData ?? [];

  // Only fetch areas if programObj is ready
  const { areas: areasData, loading, error, refetch } = useFetchProgramAreas({
    title,
    year,
    accredBody,
    level: formattedLevel,
    program
  });

  const { 
    users: taskForce, 
    loading: taskForceLoading, 
    error: taskForceError, 
    refetch: taskForceRefetch 
  } = useUsersBy();

  console.log(taskForce);
  const data = areasData?.data ?? [];
  const areasByLevelData = areasByLevel?.areas ?? [];
  console.log(data);
  const areaArray = data.map((item) => {
    return item.area_id;
  });

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [areas, setAreas] = useState([]);
  const [areaInput, setAreaInput] = useState('');
  const [duplicateValues, setDuplicateValues] = useState([]);
  const [activeAreaId, setActiveAreaId] = useState(null);
  const [selectedTaskForce, setSelectedTaskForce] = useState([]); // State for selected checkboxes (AreaModal)
  const [activeTaskForceId, setActiveTaskForceId] = useState(null);
  const [showConfirmUnassign, setShowConfirmUnassign] = useState(false);

  console.log('Active Task Force ID:', activeTaskForceId);

  // Auto focus input when 
  const areaInputRef = useAutoFocus(modalType, modalType === MODAL_TYPE.ADD_AREA);

  // Remove duplicates automatically if areas state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => areas.includes(val)));
  }, [areas]);

  useEffect(() => {
    const modalType = localStorage.getItem('modal-type');
    const modalData = localStorage.getItem('modal-data');
    setModalData(JSON.parse(modalData));
    setModalType(JSON.parse(modalType));

  }, []);
  console.log(modalType);

  // Reuse useOutsideClick hook to make area options disappear
  useOutsideClick(areaOptionsRef, () => setActiveAreaId(null));

  // Reuse useOutsideClick hook to make assigned task force options disappear
  useOutsideClick(assignedTaskForceRef, () => setActiveTaskForceId(null));


  const findDuplicate = (value) => {
    return data.some(d => d.area.toUpperCase().trim() === value.toUpperCase().trim());
  };

  const handleCloseModal = (from = {}) => {
    const { addArea, assignTaskForce, viewAssignedTaskForce, confirmUnassign, removeArea } = from;

    if (addArea) {
      setAreas([]);
      setModalData(null);
      setModalType(null);
    }

    if (assignTaskForce) {
      setSelectedTaskForce([]);
      setModalData(null);
      setModalType(null);
    }

    if (viewAssignedTaskForce || modalData?.taskForces?.length === 0) {
      setModalData(null);
      setModalType(null);
      localStorage.removeItem('modal-type');
      localStorage.removeItem('modal-data');
    }

    if (removeArea) {
      setModalData(null);
      setModalType(null);
    }

    if (confirmUnassign) {
      setShowConfirmUnassign(false);
    }
  };

  const handleAreaInputChange = (e) => {
    setAreaInput(e.target.value);
  };

  const handleAddAreaClick = () => {
    setModalType(MODAL_TYPE.ADD_AREA);
  };

  const handleAddAreaValue = (val) => {
    if (findDuplicate(val)) {
      const formattedVal = formatArea(val);
      setDuplicateValues(prev => [...new Set([...prev, formattedVal])]);
      showErrorToast(`${val} already exist.`, 'top-center');
      return;
    }
    setAreas(prev => [...prev, formatArea(val)]);
    setDuplicateValues(prev => prev.filter(v => v !== formatArea(val)));
  };

  const handleRemoveAreaValue = (index) => {
    const removedVal = areas[index];
    setAreas(prev => prev.filter((_, i) => i !== index));
    setDuplicateValues(prev => prev.filter(v => v !== removedVal));
  };

  // Remove all areas at once
  const handleRemoveAllAreas = () => {
    setAreas([]); // clear selected areas
    setDuplicateValues([]); // reset duplicates
  };


  const handleSaveAreas = async () => {
    if (!areas.length) return;

    try {
      const res = await addProgramAreas({
        title,
        year,
        accredBody,
        level: formattedLevel,
        program,
        areaNames: areas
      });
      if (res.data.success) {
        showSuccessToast(TOAST_MESSAGES.AREA_ADDITION.SUCCESS);
        handleCloseModal({ addArea: true });
        await refetch(); // Refresh areas after save
      }
      
    } catch (err) {
      const isDuplicate = err?.response?.data?.isDuplicate;
      const duplicateValue = err?.response?.data?.duplicateValue;
      const message = err?.response?.data?.message;

      if (isDuplicate && duplicateValue) {
        setDuplicateValues(prev => [...new Set([...prev, duplicateValue])]);
        showErrorToast(message);
      }
    }
  };

  const handleAreaCardClick = (areaUUID) => {
    navigate(AREA_PARAMETERS({ accredInfoUUID, level, programUUID, areaUUID }));
  };

  const handleAreaOptionClick = (e, data = {}) => {
    e.stopPropagation();
    setActiveAreaId(data?.areaID);
  };

  const handleUserCircleClick = (e, data = {}) => {
    e.stopPropagation();
    const { accredId, levelId, programId, areaId, area } = data;
    setModalType(MODAL_TYPE.ASSIGN_TASK_FORCE);
    setModalData({
      accredId, 
      levelId, 
      programId, 
      areaId, 
      area: formatAreaName(area)
    });
  };

  const handleOptionItemClick = async (e, data = {}) => {
    e.stopPropagation();
    setActiveAreaId(null);
    if (data && data.label === 'View Parameters' && data.areaUUID) {
      const areaUUID = data.areaUUID;
      navigate(AREA_PARAMETERS({ accredInfoUUID, level, programUUID, areaUUID }));

    } else if (data && data.label === 'Assign Task Force') {
      handleUserCircleClick(e, data);

    } else if (data && data.label === 'Delete') {
      setModalType(MODAL_TYPE.REMOVE_AREA);
      setModalData({
        title: data.title,
        year: data.year,
        accredBody: data.accredBody,
        level: data.level,
        program: data.program,
        area: data.area
      });

    }
    
  };

  const handleConfirmRemoval = async (data = {}) => {
    console.log(data.area);
    try {
      const res = await deletePAM({
        title: data.title,
        year: data.year,
        accredBody: data.accredBody,
        level: data.level,
        program: data.program,
        area: data.area
      });

      if (res.data.success) showSuccessToast(`${data.area} deleted successfully!`);

      handleCloseModal({ removeArea: true });

    } catch (error) {
      console.error(error);
    }
  };

  // Toggle single checkbox (AreaModal)
  const handleCheckboxChange = (userId) => {
    setSelectedTaskForce((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) // Remove if already selected
        : [...prev, userId] // Add if not selected
    );
  };

  // Toggle Select All (AreaModal)
  const handleSelectAll = () => {
    if (selectedTaskForce.length === taskForce.length) {
      setSelectedTaskForce([]); // Unselect all
    } else {
      setSelectedTaskForce(taskForce.map((user) => user.id)); // select all by id
    }
  };

  // Pass selectedTaskForce to backend on save (AreaModal)
  const handleAssignTaskForce = async (data = {}) => {
    const { accredInfoId, levelId, programId, areaId, area } = data;
    const userIDList = selectedTaskForce;
   
    try {
      const res = await addAssignment({
        accredInfoId, 
        levelId, 
        programId, 
        areaId,
        userIDList
      });

      console.log(res);
      if (res?.data?.success) {
        showSuccessToast(ASSIGNMENT.SUCCESS);
      }

      handleCloseModal({ assignTaskForce: true });

    } catch (error) {
      const userId = error?.response?.data?.error?.user;
      const user = getFullNameById(taskForce, userId);
      
      if (userId && user) {
        showErrorToast(`${user} is already assigned to ${area}.`, 'top-center');

      } else {
        showErrorToast(ASSIGNMENT.ERROR);
      }

      throw error;
    }
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
    console.log('Profile stack is clicked!')
    console.log(data);
    
  };

  console.log({ modalType, modalData });

  // For AreaModal.jsx
  const handleEllipsisClick = (data = {}) => {
    const { taskForceId } = data;
    console.log('ellipsis clicked!');
    setActiveTaskForceId(prev => prev === taskForceId ? null : taskForceId);
  };

  // For AreaModal.jsx
  const handleAddTaskForceClick = () => {
    setModalType(MODAL_TYPE.ASSIGN_TASK_FORCE);
  };

  // For AreaModal.jsx
  const handleUnassignedAllClick = () => {
    console.log('unassigned all clicked!')
  };

  // For AreaModal.jsx (Assigned Task Force Options)
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

  // For AreaModal.jsx (Assigned Task Force option - Unassigned)
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
      areaId, taskForceId 
    } = data;

    console.log({ accredInfoId, levelId, programId, 
      areaId, taskForceId });

    try {
      const res = await deleteAssignment({
        accredInfoId, levelId, programId,
        areaId, taskForceId
      });

      console.log(res);

      handleCloseModal({ confirmUnassign: true });
      setModalData(prev => ({
        ...prev,
        taskForces: modalData.taskForces.filter(tf => tf.id !== taskForceId)
      }));

      if (res.data.success) {
        showSuccessToast(UNASSIGN.SUCCESS);
      }

    } catch (error) {
      showErrorToast(UNASSIGN.ERROR);
      console.error('Error deleting assigment:', error);
      throw error;
    }
  };

  console.log(modalData?.taskForces?.length);

  return {
    navigation: {
      navigate
    },

    params: {
      accredInfoUUID, 
      programUUID, 
      level
    }, 

    datas: {
      title,
      year,
      accredBody,
      areasData,
      areasByLevelData,
      data,
      loading,
      error,
      formattedLevel,
      program,
      activeAreaId,
      taskForce,
      taskForceLoading,
      taskForceError,
      taskForceRefetch,
      selectedTaskForce,
      assignmentData,
      loadingAssignments,
      errorAssignments,
      refetchAssignments,
      activeTaskForceId,
      showConfirmUnassign
    },

    inputs: {
      areas,
      areaInput,
      setAreaInput
    },

    refs: {
      areaInputRef,
      areaOptionsRef,
      assignedTaskForceRef
    },

    values: {
      duplicateValues
    },

    modals: {
      modalType,
      modalData
    },

    handlers: {
      handleCloseModal,
      handleAreaInputChange,
      handleAddAreaClick,
      handleAddAreaValue,
      handleRemoveAreaValue,
      handleRemoveAllAreas,
      handleSaveAreas,
      handleAreaCardClick,
      handleAreaOptionClick,
      handleOptionItemClick,
      handleConfirmRemoval, 
      handleCheckboxChange,
      handleSelectAll,
      handleAssignTaskForce,
      handleProfileStackClick,
      handleEllipsisClick,
      handleUserCircleClick,
      handleAddTaskForceClick,
      handleUnassignedAllClick,
      handleUnassignedClick,
      handleAssignedOptionsClick,
      handleConfirmUnassign
    }
  }
};

export default useProgramAreas;