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
import PATH from "../../constants/path";

const { SUBPARAMETER_ADDITION } = TOAST_MESSAGES;
const { SUBPARAM_INDICATORS } = PATH.DEAN;

const useParamSubparam = () => {
  const navigate = useNavigate();
  const { accredInfoUUID, level, programUUID, areaUUID, parameterUUID } = useParams();

  const { level: levelName } = formatProgramParams(level);

  const {
    title,
    year,
    accredBody,
    program,
  } = useProgramToBeAccreditedDetails(accredInfoUUID, programUUID);

  const { area } = useProgramAreaDetails({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    areaUUID
  });

  const { paramName: parameter } = useAreaParamsDetails({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    area,
    parameterUUID
  });
  console.log({
    title,
    year,
    accredBody,
    program
  });
  console.log('Area name:', area);
  console.log('Parameter name:', parameter);

  const { subParameters, loading, error, refetch } = useFetchParamSubparam({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    area,
    parameter
  });

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

  const handleAddSubparamClick = () => {
    setModalType(MODAL_TYPE.ADD_SUBPARAMETERS);
    console.log('clicked');
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
        title,
        year,
        accredBody,
        level: levelName,
        program,
        area,
        parameter,
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

  const handleSPCardClick = (data = {}) => {
    console.log('Clicked');
    const subParameterUUID = data?.subParameterUUID;
    navigate(SUBPARAM_INDICATORS({
      accredInfoUUID,
      level,
      programUUID,
      areaUUID,
      parameterUUID,
      subParameterUUID
    }));
  };

  return {
    navigate,
    modalType,

    refs: {
      subParamInputRef
    },
    
    params: {
      accredInfoUUID,
      level,
      programUUID,
      areaUUID,
      parameterUUID
    },

    datas: {
      subParameters,
      loading,
      error,
      refetch,
      levelName,
      program,
      area,
      parameter,
      subParamsData,
      subParameterInput,
      subParamsArr,
      duplicateValues,
    },

    handlers: {
      handleAddSubparamClick,
      handleCloseModal,
      handleSubParamChange,
      handleAddSubParamValue,
      handleRemoveSubParamValue,
      handleSaveSubParams,
      handleSPCardClick
    }
  };
};

export default useParamSubparam;