import { useNavigate, useParams } from "react-router-dom";
import { useAreaParamsDetails, useParamSubparamDetails, useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchSubparamIndicators from "../fetch-react-query/useFetchSubparamIndicators";
import { useMemo } from "react";

const useSubparamIndicator = () => {
  const navigate = useNavigate();
  const { subParamUUID } = useParams();
  const accredInfoUUID = localStorage.getItem('a_uuid');
  const level = localStorage.getItem('a_level');
  const programUUID = localStorage.getItem('a_p_uuid');
  const areaUUID = localStorage.getItem('a_a_uuid');
  const paramUUID = localStorage.getItem('a_pa_uuid');

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

  const { subParamId, subParam, subParamObj } = useParamSubparamDetails({
    title, year, accredBody, level, program,
    area, parameter: paramName, subParameterUUID: subParamUUID
  });

  const { indicators, error, loading } = useFetchSubparamIndicators({
    title, year, accredBody, level, program,
    area, parameter: paramName, subParameter: subParam
  });
  const indicatorsData = useMemo(() => indicators?.data ?? [], [indicators?.data]);

  console.log(indicatorsData);

  return {
    navigate,
    datas: {
      accredInfoUUID, title, year, level, 
      programUUID, program, areaUUID, area,
      paramUUID, paramName, subParamUUID, 
      subParam, indicatorsData
    }
  };
};

export default useSubparamIndicator;