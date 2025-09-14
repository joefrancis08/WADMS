import { useMemo } from "react";
import formatToLocalDate from "../utils/formatToLocalDate";
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

export const useProgramAreaDetails = ({ startDate, endDate, levelName, programName, areaID }) => {
  const { areas: areasData } = useFetchProgramAreas(
    startDate, 
    endDate, 
    levelName, 
    programName,
    !!programName && !!startDate && !!endDate
  );

  const data = useMemo(() => areasData?.data ?? [], [areasData?.data]);

  return useMemo(() => {
    const areaObj = data.find(a => a.area_uuid === areaID) ?? null;

    return {
      areaName: areaObj ? areaObj.area : '',
      areaObj
    }
  }, [data, areaID]);
};

export const useAreaParamsDetails = ({
  startDate,
  endDate,
  levelName,
  programName,
  areaName,
  parameterID,
}) => {
  const { parameters } = useFetchAreaParameters(
    startDate, 
    endDate, 
    levelName, 
    programName,
    areaName, 
    !!areaName 
  );

  const data = useMemo(() => parameters?.data ?? [], [parameters?.data]);

  return useMemo(() => {
    const paramObj = data.find(p => p.parameter_uuid === parameterID) ?? null;

    return {
      paramName: paramObj ? paramObj.parameter : '',
      paramObj
    }
  }, [data, parameterID]);
};