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
import { addProgramAreas, deletePAM } from "../../api-calls/accreditation/accreditationAPI";
import { TOAST_MESSAGES } from "../../constants/messages";
import PATH from "../../constants/path";
import useFetchAreasByLevel from "../fetch-react-query/useFetchAreasByLevel";

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
  const data = areasData?.data ?? [];
  const areasByLevelData = areasByLevel?.areas ?? [];

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [areas, setAreas] = useState([]);
  const [areaInput, setAreaInput] = useState('');
  const [duplicateValues, setDuplicateValues] = useState([]);

  const [activeAreaId, setActiveAreaId] = useState(null);

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
    navigate(PATH.DEAN.AREA_PARAMETERS({ accredInfoUUID, level, programUUID, areaUUID }));
  };

  const handleAreaOptionClick = (e, data = {}) => {
    e.stopPropagation();
    setActiveAreaId(data?.areaID);
  };

  const handleOptionItemClick = async (e, data = {}) => {
    e.stopPropagation();
    if (data && data.label === 'Remove') {
      setModalType(MODAL_TYPE.REMOVE_AREA);
      setActiveAreaId(null);
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
      activeAreaId
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
      handleConfirmRemoval
    }
  }
};

export default useProgramAreas;