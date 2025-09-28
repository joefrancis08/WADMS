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
import { addAssignment, addProgramAreas, deletePAM } from "../../api-calls/accreditation/accreditationAPI";
import { TOAST_MESSAGES } from "../../constants/messages";
import PATH from "../../constants/path";
import useFetchAreasByLevel from "../fetch-react-query/useFetchAreasByLevel";
import { useUsersBy } from "../fetch-react-query/useUsers";

const { AREA_PARAMETERS } = PATH.DEAN;

const useProgramAreas = () => {
  const navigate = useNavigate();
  const areaOptionsRef = useRef();
  const { accredInfoUUID, level, programUUID } = useParams();
  const { level: formattedLevel } = formatProgramParams(level);

  const { areas: areasByLevel } = useFetchAreasByLevel(formattedLevel);

  const { title, year, accredBody, program } = useProgramToBeAccreditedDetails(accredInfoUUID, programUUID);

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

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [areas, setAreas] = useState([]);
  const [areaInput, setAreaInput] = useState('');
  const [duplicateValues, setDuplicateValues] = useState([]);
  const [activeAreaId, setActiveAreaId] = useState(null);
  const [selectedTaskForce, setSelectedTaskForce] = useState([]); // State for selected checkboxes (AreaModal)

  console.log(areasByLevelData);

  // Auto focus input when 
  const areaInputRef = useAutoFocus(modalType, modalType === MODAL_TYPE.ADD_AREA);

  // Remove duplicates automatically if areas state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => areas.includes(val)));
  }, [areas]);

  // Reuse useOutsideClick hook to make area options disappear
  useOutsideClick(areaOptionsRef, () => setActiveAreaId(null));

  const findDuplicate = (value) => {
    return data.some(d => d.area.toUpperCase().trim() === value.toUpperCase().trim());
  };

  const handleCloseModal = () => {
    setModalType(null);
    setAreas([]);
    setModalData(null);
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
        handleCloseModal();
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

  const handleOptionItemClick = async (e, data = {}) => {
    console.table({data})
    e.stopPropagation();
    setActiveAreaId(null);
    if (data && data.label === 'View Parameters' && data.areaUUID) {
      const areaUUID = data.areaUUID;
      navigate(AREA_PARAMETERS({ accredInfoUUID, level, programUUID, areaUUID }));
      

    } else if (data && data.label === 'Assign Task Force') {
      const { accredId, levelId, programId, areaId, area } = data;
      setModalType(MODAL_TYPE.ASSIGN_TASK_FORCE);
      console.log(data);
      setModalData({
        accredId, 
        levelId, 
        programId, 
        areaId, 
        area
      });

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
    try {
      const res = await deletePAM({
        title: data.title,
        year: data.year,
        accredBody: data.accredBody,
        level: data.level,
        program: data.program,
        area: data.area
      });

      if (res.data.success) showSuccessToast(`${data.area} removed successfully!`);

      handleCloseModal();

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
    const { accredInfoId, levelId, programId, areaId } = data;
    const userIDList = selectedTaskForce;
    console.log("Selected users:", selectedTaskForce);
    console.log(data);
    // TODO: call the backend here (axios)
    try {
      const res = await addAssignment({
        accredInfoId, 
        levelId, 
        programId, 
        areaId,
        userIDList
      });

      console.log(res);

    } catch (error) {
      console.error('Error assigning taskforce:', error);
      throw error;
    }
  };

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
      selectedTaskForce
    },

    inputs: {
      areas,
      areaInput,
      setAreaInput
    },

    refs: {
      areaInputRef,
      areaOptionsRef
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
      handleAssignTaskForce
    }
  }
};

export default useProgramAreas;