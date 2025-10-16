import { useNavigate, useParams } from "react-router-dom";
import formatProgramParams from "../../utils/formatProgramParams";
import { useAreaParamsDetails, useParamSubparamDetails, useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchSubparamIndicators from "../fetch-react-query/useFetchSubparamIndicators";
import { useEffect, useState } from "react";
import MODAL_TYPE from "../../constants/modalTypes";
import useAutoFocus from "../useAutoFocus";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { addIndicators, fetchDocumentsDynamically } from "../../api-calls/accreditation/accreditationAPI";
import { TOAST_MESSAGES } from "../../constants/messages";
import { useDocumentsQueries } from "../fetch-react-query/useDocumentsQueries";

const { INDICATORS_ADDITION } = TOAST_MESSAGES;

const useSubparamIndicators = () => {
  const navigate = useNavigate();

  const { 
    accredInfoUUID, 
    level, 
    programUUID, 
    areaUUID, 
    parameterUUID, 
    subParameterUUID 
  } = useParams();

  const { level: levelName } = formatProgramParams(level);

  const {
    accredInfoId,
    title, 
    year, 
    accredBody, 
    levelId,
    programId,
    program
  } = useProgramToBeAccreditedDetails(accredInfoUUID, programUUID);

  const { areaId, area } = useProgramAreaDetails({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    areaUUID
  });

  const { paramName: parameter, paramId } = useAreaParamsDetails({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    area,
    parameterUUID
  });

  const { subParamId, subParam } = useParamSubparamDetails({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    area,
    parameter,
    subParameterUUID
  });

  const { indicators, loading, error, refetch } = useFetchSubparamIndicators({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    area,
    parameter,
    subParameter: subParam
  });

  console.log("Fetching indicators with:", {
    title, year, accredBody, level, program, area, parameter, subParameter: subParam
  });

  const indicatorsArr = indicators?.data ?? [];

  console.log(indicatorsArr);

  const indicatorDocs = useDocumentsQueries(
    indicatorsArr,
    { accredInfoId, levelId, programId, areaId, paramId, subParamId },
    fetchDocumentsDynamically,
    'indicator_id',
    'indicator'
  );

  console.log(indicatorDocs?.data);

  const documentsByIndicator = {};
  indicatorDocs.forEach((ind, i) => {
    const documents = ind.data?.data?.documents ?? [];
    documentsByIndicator[indicatorsArr[i]?.indicator_id] = Array.isArray(documents) ? documents : [];
  });

  console.log(documentsByIndicator);

  const [modalType, setModalType] = useState(null);
  const [indicatorInput, setIndicatorInput] = useState('');
  const [inputtedIndicators, setInputtedIndicators] = useState([]);
  const [duplicateValues, setDuplicateValues] = useState([]);

  const indicatorInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_INDICATORS
  );

  // Remove duplicate automatically if sub-parameter state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => inputtedIndicators.includes(val)));
  }, [inputtedIndicators]);

  const findDuplicate = (value) => {
    return indicatorsArr.some(i => i.indicator.trim() === value.trim());
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleAddIndClick = () => {
    setModalType(MODAL_TYPE.ADD_INDICATORS);
  };

  const handleIndicatorChange = (e) => {
    setIndicatorInput(e.target.value)
  };

  const handleAddIndicatorValue = (val) => {
    if (findDuplicate(val)) {
      setDuplicateValues(prev => [...new Set([...prev, val])]);
      showErrorToast(`${val} already exist.`, 'top-center');
      return;
    }

    setInputtedIndicators([...inputtedIndicators, val]);
    setDuplicateValues(prev => prev.filter(v => v !== val));
  };

  const handleRemoveIndicatorValue = (index) => {
    const removedVal = inputtedIndicators[index];
    setInputtedIndicators(inputtedIndicators.filter((_, i) => i !== index));
    setDuplicateValues(prev => prev.filter(v => v !== removedVal));
  };

  const handleSaveIndicators = async () => {
    try {
      const res = await addIndicators({
        title,
        year,
        accredBody,
        level: levelName,
        program,
        area,
        parameter,
        subParameter: subParam,
        indicatorNames: inputtedIndicators
      });

      if (res.data.success) {
        showSuccessToast(INDICATORS_ADDITION.SUCCESS);
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

    refs: {
      indicatorInputRef
    },

    params: {
      accredInfoUUID,
      level,
      programUUID,
      areaUUID,
      parameterUUID,
      subParameterUUID
    },

    datas: {
      title,
      year,
      levelName,
      program,
      area,
      parameter,
      modalType,
      indicatorInput,
      inputtedIndicators,
      duplicateValues,
      subParam,
      indicatorsArr,
      loading,
      error,
      refetch
    },

    handlers: {
      handleCloseModal,
      handleAddIndClick,
      handleIndicatorChange,
      handleAddIndicatorValue,
      handleRemoveIndicatorValue,
      handleSaveIndicators
    }
  };
};

export default useSubparamIndicators;