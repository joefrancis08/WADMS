import { useNavigate, useParams } from "react-router-dom";
import { TOAST_MESSAGES } from "../../constants/messages";
import PATH from "../../constants/path";
import formatProgramParams from "../../utils/formatProgramParams";
import { useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchAreaParameters from "../fetch-react-query/useFetchAreaParameters";
import { useEffect, useState } from "react";
import useAutoFocus from "../useAutoFocus";
import MODAL_TYPE from "../../constants/modalTypes";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { addAreaParameters } from "../../api-calls/accreditation/accreditationAPI";

const { PARAMETER_ADDITION } = TOAST_MESSAGES;

const useAreaParameters = () => {
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
  console.log(parameters);

  const parameterData = parameters.data ?? [];

  const [modalType, setModalType] = useState(null);
  const [parametersArr, setParametersArr] = useState([]);
  const [parameterInput, setParameterInput] = useState('');
  const [duplicateValues, setDuplicateValues] = useState([]);

  // Auto-focus parameter input
  const parameterInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_PARAMETER
  );

  // Remove duplicate automatically if parameter state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => parametersArr.includes(val)));
  }, [parametersArr]);

  const findDuplicate = (value) => {
    return parameterData.some(d => d.parameter.trim() === value.trim());
  };

  const handlePlusClick = () => {
    setModalType(MODAL_TYPE.ADD_PARAMETER);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setParametersArr([]);
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

      handleCloseModal();

    } catch (error) {
      const duplicateValue = error?.response?.data?.error?.duplicateValue;
      setDuplicateValues(prev => [...new Set([...prev, duplicateValue])]);
      showErrorToast(`${duplicateValue} already exist.`, 'top-center');
    }
  };

  return {
    params: {
      accredInfoUUID,
      level,
      programUUID,
      areaUUID
    },

    navigation: {
      navigate
    },

    refs: {
      parameterInputRef
    },

    modals: {
      modalType
    },

    inputs: {
      parameterInput
    },

    datas: {
      levelName,
      program,
      area,
      parameters,
      loading,
      error,
      parameterData,
      parametersArr,
      duplicateValues
    },

    handlers: {
      handleCloseModal,
      handlePlusClick,
      handleParameterChange,
      handleAddParameterValue,
      handleRemoveParameterValue,
      handleSaveParameters
    }
  }
};

export default useAreaParameters;