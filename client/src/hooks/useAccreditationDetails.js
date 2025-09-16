import { useMemo } from "react";
import useFetchProgramAreas from "./fetch-react-query/useFetchProgramAreas";
import useFetchAreaParameters from "./fetch-react-query/useFetchAreaParameters";
import { useFetchILP } from "./fetch-react-query/useFetchILP";

export const useProgramToBeAccreditedDetails = (accredInfoUUID, programUUID) => {
  const { accredInfoLevelPrograms } = useFetchILP();
  const accredILPData = useMemo(() => accredInfoLevelPrograms.data ?? [], [accredInfoLevelPrograms]);

  return useMemo(() => {
    const programObj = accredILPData.find(p => p.accred_uuid === accredInfoUUID && p.program_uuid === programUUID);
    console.log(programObj);

    return {
      title: programObj?.accred_title,
      year: programObj?.accred_year,
      accredBody: programObj?.accred_body_name,
      program: programObj?.program?.program ?? '',
      programObj
    };
  }, [accredILPData, accredInfoUUID, programUUID]);
};

export const useProgramAreaDetails = ({ title, year, accredBody, level, program, areaUUID }) => {
  const { areas: areasData } = useFetchProgramAreas(
    {
      title, 
      year, 
      accredBody, 
      level,
      program,
    },
    !!program
  );

  const data = useMemo(() => areasData?.data ?? [], [areasData?.data]);
  console.log(data);

  return useMemo(() => {
    const areaObj = data.find(a => a.area_uuid === areaUUID) ?? null;

    return {
      area: areaObj ? areaObj.area : '',
      areaObj
    }
  }, [data, areaUUID]);
};

export const useAreaParamsDetails = ({
  title,
  year,
  accredBody,
  level,
  program,
  area,
  parameterUUID,
}) => {
  const { parameters } = useFetchAreaParameters(
    {
      title,
      year,
      accredBody,
      level, 
      program,
      area, 
    }, !!area
  );

  const data = useMemo(() => parameters?.data ?? [], [parameters?.data]);

  return useMemo(() => {
    const paramObj = data.find(p => p.parameter_uuid === parameterUUID) ?? null;

    return {
      paramName: paramObj ? paramObj.parameter : '',
      paramObj
    }
  }, [data, parameterUUID]);
};