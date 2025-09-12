import { useMemo } from "react";
import formatToLocalDate from "../utils/formatToLocalDate";
import useFetchProgramAreas from "./fetch-react-query/useFetchProgramAreas";
import useFetchAreaParameters from "./fetch-react-query/useFetchAreaParameters";
import { useFetchILP } from "./fetch-react-query/useFetchILP";

export const useProgramToBeAccreditedDetails = (periodID, programID) => {
  const { programsToBeAccredited } = useFetchILP();
  const programsData = useMemo(() => programsToBeAccredited.data ?? [], [programsToBeAccredited.data]);

  return useMemo(() => {
    const programObj = programsData.find(p => p.period_uuid === periodID && p.program_uuid === programID);

    return {
      programName: programObj?.program?.program ?? '',
      startDate: formatToLocalDate(programObj?.period?.period_start) ?? null,
      endDate: formatToLocalDate(programObj?.period?.period_end) ?? null,
      programObj
    };
  }, [programsData, periodID, programID]);
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