import { useNavigate, useParams } from "react-router-dom";
import formatProgramParams from "../../utils/formatProgramParams";
import { useAreaParamsDetails, useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchParamSubparam from "../fetch-react-query/useFetchParamSubparam";
import { useEffect, useState } from "react";
import useAutoFocus from "../useAutoFocus";
import MODAL_TYPE from "../../constants/modalTypes";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { addSubParams } from "../../api/accreditation/accreditationAPI";
import { TOAST_MESSAGES } from "../../constants/messages";
import useFetchAreaParameters from "../fetch-react-query/useFetchAreaParameters";

const { SUBPARAMETER_ADDITION } = TOAST_MESSAGES;

const useParamSubparam = () => {
  const navigate = useNavigate();
  const { periodID, level, programID, areaID, parameterID } = useParams();

  const { level: levelName } = formatProgramParams(level);

  const {
    startDate,
    endDate,
    programName
  } = useProgramToBeAccreditedDetails(periodID, programID);

  const { areaName } = useProgramAreaDetails({
    startDate,
    endDate,
    levelName,
    programName,
    areaID
  });

  const { paramName: parameterName } = useAreaParamsDetails({
    startDate,
    endDate,
    levelName,
    programName,
    areaName,
    parameterID
  });

  console.log('Parameter name:', parameterName);

  const { subParameters, loading, error, refetch } = useFetchParamSubparam(
    startDate,
    endDate,
    levelName,
    programName,
    areaName,
    parameterName
  );

  const subParamsData = subParameters.data ?? [];

  const [modalType, setModalType] = useState(null);
  const [subParameterInput, setSubParameterInput] = useState('');
  const [subParamsArr, setSubParamsArr] = useState([]);
  const [duplicateValues, setDuplicateValues] = useState([]);

  // Auto-focus on sub-parameter input
  const subParamInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_SUBPARAMETERS
  );

  // Remove duplicate automatically if sub-parameter state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => subParamsArr.includes(val)));
  }, [subParamsArr]);

  const findDuplicate = (value) => {
    return subParamsData.some(d => d.sub_parameter.trim() === value.trim());
  };

  const handleSubparamCardClick = () => {
    setModalType(MODAL_TYPE.ADD_SUBPARAMETERS);
  };

  const handleCloseModal = () => {
    setSubParamsArr([]);
    setModalType(null);
  };

  const handleSubParamChange = (e) => {
    setSubParameterInput(e.target.value)
  };

  const handleAddSubParamValue = (val) => {
    if (findDuplicate(val)) {
      setDuplicateValues(prev => [...new Set([...prev, val])]);
      showErrorToast(`${val} already exist.`, 'top-center');
      return;
    }

    setSubParamsArr([...subParamsArr, val]);
    setDuplicateValues(prev => prev.filter(v => v !== val));
  };

  const handleRemoveSubParamValue = (index) => {
    const removedVal = subParamsArr[index];
    setSubParamsArr(subParamsArr.filter((_, i) => i !== index));
    setDuplicateValues(prev => prev.filter(v => v !== removedVal));
  };

  const handleSaveSubParams = async () => {
    try {
      const res = await addSubParams({
        startDate,
        endDate,
        levelName,
        programName,
        areaName,
        parameterName,
        subParameterNames: subParamsArr
      });

      if (res.data.success) {
        showSuccessToast(SUBPARAMETER_ADDITION.SUCCESS);
      }

      handleCloseModal();

    } catch (error) {
      const duplicateValue = error?.response?.data?.error?.duplicateValue;
      console.log(duplicateValue);
      setDuplicateValues(prev => [...new Set([...prev, duplicateValue])]);
      showErrorToast(`${duplicateValue} already exist.`, 'top-center');
    }
  };

  return {
    navigate,
    modalType,

    refs: {
      subParamInputRef
    },
    
    params: {
      periodID,
      level,
      programID,
      areaID,
      parameterID
    },

    datas: {
      subParameters,
      loading,
      error,
      refetch,
      levelName,
      programName,
      areaName,
      parameterName,
      subParamsData,
      subParameterInput,
      subParamsArr,
      duplicateValues,
    },

    handlers: {
      handleSubparamCardClick,
      handleCloseModal,
      handleSubParamChange,
      handleAddSubParamValue,
      handleRemoveSubParamValue,
      handleSaveSubParams
    }
  };
};

export default useParamSubparam;