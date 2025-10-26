import { useNavigate, useParams } from "react-router-dom";
import { useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchProgramAreas from "../fetch-react-query/useFetchProgramAreas";
import { useMemo } from "react";
import PATH from "../../constants/path";
import usePageTitle from "../usePageTitle";

const { AREA_PARAMETERS } = PATH.TASK_FORCE;

const useProgramAreas = () => {
  const navigate =  useNavigate();
  const { programUUID } = useParams();
  const accredInfoUUID = localStorage.getItem('a_uuid');
  const level = localStorage.getItem('a_level');

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

  const { 
    areas, 
    loading, 
    error 
  } = useFetchProgramAreas({ title, year, accredBody, level, program });
  const areasData = useMemo(() => areas?.data ?? [], [areas?.data]);

  console.log({ areasData });

  usePageTitle('Areas');

  const handleAreaCardClick = (areaUUID) => {
    console.log(areaUUID);
    localStorage.setItem('a_p_uuid', programUUID);
    navigate(AREA_PARAMETERS(areaUUID));
  };

  return {
    navigate,
    params: { programUUID },
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
      program,
      areas: areasData
    },
    helpers: {},
    handlers: {
      handleAreaCardClick
    }
  }
};

export default useProgramAreas;