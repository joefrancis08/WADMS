import { useNavigate, useParams } from "react-router-dom";
import formatProgramParams from "../../utils/formatProgramParams";
import { useAreaParamsDetails, useParamSubparamDetails, useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchSubparamIndicators from "../fetch-react-query/useFetchSubparamIndicators";

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

  const { title, year, accredBody, program } = useProgramToBeAccreditedDetails(accredInfoUUID, programUUID);

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

  const { subParam } = useParamSubparamDetails({
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

  const indicatorsArr = indicators?.data ?? [];

  return {
    navigate,
    
    params: {
      accredInfoUUID,
      level,
      programUUID,
      areaUUID,
      parameterUUID,
      subParameterUUID
    },

    data: {
      subParam,
      indicatorsArr,
      loading,
      error,
      refetch
    }
  };
};

export default useSubparamIndicators;