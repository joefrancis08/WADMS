import React from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { ChevronRight, FileStack } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import { useNavigate, useParams } from 'react-router-dom';
import PATH from '../../constants/path';
import formatProgramParams from '../../utils/formatProgramParams';
import formatAreaName from '../../utils/formatAreaName';
import useFetchProgramAreas from '../../hooks/fetch-react-query/useFetchProgramAreas';
import useFetchAreaParameters from '../../hooks/fetch-react-query/useFetchAreaParameters';
import formatParameterName from '../../utils/formatParameterName';

const ParamSubparam = () => {
  const navigate = useNavigate();
  const { period, level, program, area, parameter } = useParams();

  const { PROGRAMS_TO_BE_ACCREDITED, AREA_PARAMETERS, PROGRAM_AREAS } = PATH.DEAN;

  const { startDate, endDate, level: formattedLevel, program: formattedProgram} = formatProgramParams(period, level, program);

  const { areas: areasData } = useFetchProgramAreas(
    startDate, 
    endDate, 
    formattedLevel, 
    formattedProgram
  );

  const data = areasData.data ?? [];

  const areaObj = data.find(d => d.area_uuid === area) ?? null;
  const areaName = areaObj ? areaObj.area : 'Unknown area';

  const { parameters, loading, error, refetch } = useFetchAreaParameters(
    startDate, 
    endDate, 
    formattedLevel, 
    formattedProgram, 
    areaName ?? ''
  );

  const parameterData = parameters.data ?? [];

  const parameterObj = parameterData.find(p => p.parameter_uuid === parameter) ?? null;
  const parameterName = parameterObj ? parameterObj.parameter : 'Unknown Parameter';


  return (
    <DeanLayout>
      <div className='flex-1'>
        <ContentHeader 
          headerIcon={FileStack}
          headerTitle={'Sub-Parameters'}
          searchTitle={'Search sub-parameter'}
          placeholder={'Search sub-parameter...'}
          condition={false}
        />

        <div className='flex justify-between px-4 pt-4'>
          <p className='flex flex-row items-center'>
            <span 
              title='Back to Programs'
              onClick={() => navigate(PROGRAMS_TO_BE_ACCREDITED)}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              {formattedLevel} - {formattedProgram}
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Areas'
              onClick={() => navigate(PROGRAM_AREAS({
                period,
                level,
                program
              }))}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              {formatAreaName(areaName)}
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Parameters'
              onClick={() => navigate(AREA_PARAMETERS({
                period,
                level,
                program,
                area
              }))}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              Parameter {formatParameterName(parameterName)}
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span className='font-semibold'>
              {parameterData.length > 1 ? 'Sub-Parameters' : 'Sub-Parameter'}
            </span>
          </p>
        </div>
      </div>
    </DeanLayout>
  );
};

export default ParamSubparam
