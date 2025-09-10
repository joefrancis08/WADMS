import { useMemo } from "react";
import { useFetchProgramsToBeAccredited } from "./fetch-react-query/useFetchProgramsToBeAccredited";
import formatToLocalDate from "../utils/formatToLocalDate";
import useFetchProgramAreas from "./fetch-react-query/useFetchProgramAreas";

export const useProgramToBeAccreditedDetails = (periodID, programID) => {
  const { programsToBeAccredited } = useFetchProgramsToBeAccredited();
  const programsData = useMemo(() => programsToBeAccredited.data ?? [], [programsToBeAccredited.data]);

  return useMemo(() => {
    const programObj = programsData.find(p => p.period_uuid === periodID && p.program_uuid === programID);

    return {
      programName: programObj?.program?.program ?? 'Loading program...',
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

  console.log(areasData);

  const data = useMemo(() => areasData?.data ?? [], [areasData?.data]);

  return useMemo(() => {
    const areaObj = data.find(a => a.area_uuid === areaID) ?? null

    return {
      areaName: areaObj ? areaObj.area : 'Loading area...',
      areaObj
    }
  }, [data, areaID]);
};