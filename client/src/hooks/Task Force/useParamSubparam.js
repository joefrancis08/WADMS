import { useNavigate, useParams } from "react-router-dom";
import { useAreaParamsDetails, useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchParamSubparam from "../fetch-react-query/useFetchParamSubparam";
import { useMemo } from "react";
import PATH from "../../constants/path";

const useParamSubparam = () => {
  const navigate = useNavigate();
  const { paramUUID } = useParams();
  const accredInfoUUID = localStorage.getItem('a_uuid');
  const level = localStorage.getItem('a_level');
  const programUUID = localStorage.getItem('a_p_uuid');
  const areaUUID = localStorage.getItem('a_a_uuid');

  const {
    accredInfoId, title, year, accredBody,
    levelId, programId, program, programObj,
  } = useProgramToBeAccreditedDetails(accredInfoUUID, programUUID);

  const { areaId, area, areaObj, } = useProgramAreaDetails({
    title, year, accredBody, level,
    program, areaUUID
  });

  const { paramId, paramName, paramObj } = useAreaParamsDetails({
    title, year, accredBody, level, program,
    area, parameterUUID: paramUUID
  });

  const { subParameters, loading, error, refetch } = useFetchParamSubparam({ 
    title, year, accredBody, level,
    program, area, parameter: paramName
  });
  const subParametersData = useMemo(() => subParameters?.data ?? [], [subParameters?.data]);
  
  const handleSubParamCardClick = (subParamUUID) => {
    localStorage.setItem('a_pa_uuid', paramUUID);
    navigate(PATH.TASK_FORCE.SUBPARAM_INDICATORS(subParamUUID))
  };

  console.log(subParametersData);

  return {
    navigate,
    datas: {
      accredInfoUUID,
      title,
      year,
      accredBody,
      level,
      programUUID,
      program,
      areaUUID,
      area,
      paramUUID,
      paramName, 
      subParametersData
    },
    handlers: {
      handleSubParamCardClick
    }
  };
};

export default useParamSubparam;