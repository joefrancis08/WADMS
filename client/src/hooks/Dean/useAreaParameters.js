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
import { addAreaParameters, deleteAPM } from "../../api-calls/accreditation/accreditationAPI";
import useOutsideClick from "../useOutsideClick";
import { useUsersBy } from "../fetch-react-query/useUsers";

const { PARAMETER_ADDITION } = TOAST_MESSAGES;

const useAreaParameters = () => {
  const paramOptionRef = useRef();
  const { accredInfoUUID, level, programUUID, areaUUID } = useParams();
  const { level: levelName } = formatProgramParams(level);
  const navigate = useNavigate();

  const { 
    title,
    year,
    accredBody,
    program 
  } = useProgramToBeAccreditedDetails(accredInfoUUID, programUUID);
  console.log({ title, year, accredBody, levelName, program, areaUUID })

  const { area } = useProgramAreaDetails({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    areaUUID
  });
  console.log(area);

  const { parameters, loading, error, refetch } = useFetchAreaParameters({
    title, 
    year, 
    accredBody,
    level: levelName, 
    program, 
    area
  }, !!area);
  
  const { 
    users: taskForce, 
    loading: taskForceLoading, 
    error: taskForceError, 
    refetch: taskForceRefetch 
  } = useUsersBy();

  const parameterData = parameters.data ?? [];

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [parametersArr, setParametersArr] = useState([]);
  const [parameterInput, setParameterInput] = useState('');
  const [duplicateValues, setDuplicateValues] = useState([]);
  const [isEllipsisClick, setIsEllipsisClick] = useState(false);
  const [activeParamId, setActiveParamId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  // Auto-focus parameter input
  const parameterInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_PARAMETER
  );

  // Remove duplicate automatically if parameter state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => parametersArr.includes(val)));
  }, [parametersArr]);

  useOutsideClick(paramOptionRef, () => setActiveParamId(null));

  const findDuplicate = (value) => {
    return parameterData.some(d => d.parameter.trim() === value.trim());
  };

  const handlePlusClick = () => {
    setModalType(MODAL_TYPE.ADD_PARAMETER);
  };

  const handleCloseModal = (from = {}) => {
    const { addParam, deleteParam} = from;
    
    if (addParam || deleteParam) {
      setModalType(null);
      setParametersArr([]);
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

  const handleOptionItem = (e, data = {}) => {
    e.stopPropagation();
    const { label, apmId, parameter, paramUUID } = data;
    console.log(data);

    if (label === 'View Sub-Parameters') {
      navigate(PATH.DEAN.PARAM_SUBPARAMS({ 
        accredInfoUUID, 
        level, 
        programUUID, 
        areaUUID, 
        parameterUUID: paramUUID
      }));

    } else if (label === 'Assign Task Force') {
      setModalType(MODAL_TYPE.ASSIGN_TASK_FORCE);

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
      parameterInputRef
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
      parametersArr,
      duplicateValues,
      isEllipsisClick,
      activeParamId,
      hoveredId,
      taskForce,
      taskForceLoading,
      taskForceError,
      taskForceRefetch 
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
      handleMouseLeave 
    }
  }
};

export default useAreaParameters;