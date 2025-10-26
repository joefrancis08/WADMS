import { useNavigate, useParams } from "react-router-dom";
import { useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchAreaParameters from "../fetch-react-query/useFetchAreaParameters";
import PATH from "../../constants/path";

const { PARAM_SUBPARAMS } = PATH.TASK_FORCE;

const useAreaParameters = () => {
  const navigate = useNavigate();
  const { areaUUID } = useParams();
  const accredInfoUUID = localStorage.getItem('a_uuid');
  const level = localStorage.getItem('a_level');
  const programUUID = localStorage.getItem('a_p_uuid');
  
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

  const { areaId, area, areaObj, } = useProgramAreaDetails({
    title,
    year,
    accredBody,
    level,
    program,
    areaUUID
  });

  const { parameters, loading, error, refetch } = useFetchAreaParameters({
    title,
    year,
    accredBody,
    level,
    program,
    area
  });
  const parametersData = parameters?.data ?? [];
  console.log(parametersData);

  const handleParamCardClick = (parameterUUID) => {
    console.log(parameterUUID);
    localStorage.setItem('a_a_uuid', areaUUID);
    navigate(PARAM_SUBPARAMS(parameterUUID));
  };

  return {
    navigate,
    refs: {},
    states: {
      loading,  
      error
    },
    datas: {  
      title,
      year,
      accredBody,
      level,
      programUUID,
      program,
      area,
      parameters: parametersData
    },
    helpers: {},
    handlers: {  
      handleParamCardClick
    }
  }
};

export default useAreaParameters;