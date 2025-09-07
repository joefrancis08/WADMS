import React from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import ContentHeader from '../../components/Dean/ContentHeader';
import { ChevronRight, FileSpreadsheet } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import formatProgramParams from '../../utils/formatProgramParams';
import PATH from '../../constants/path';

const AreaParameters = () => {
  const { 
    PROGRAMS_TO_BE_ACCREDITED,
    PROGRAM_AREAS_TEMPLATE
  } = PATH.DEAN;
  const navigate = useNavigate();

  const { period, level, program, area } = useParams();
  console.log(area);

  const { 
    startDate, 
    endDate, 
    level: formattedLevel, 
    program: formattedProgram,
    area: formattedArea 
  } = formatProgramParams(period, level, program, area);

  return (
    <DeanLayout>
      <div className='flex-1'>
        <ContentHeader 
          headerIcon={FileSpreadsheet}
          headerTitle={'Parameters'}
          searchTitle={'Search parameter'}
          placeholder={'Search parameter...'}
          condition={false}
        />

        <div className='flex justify-between px-4 pt-4'>
          <p className='flex flex-row items-center'>
            <span 
              title='Back to Programs'
              onClick={() => navigate(PROGRAMS_TO_BE_ACCREDITED)}
              className='hover:underline hover:text-green-800 cursor-pointer'
            >
              {formattedLevel} - {formattedProgram}
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Areas'
              onClick={() => navigate(-1)}
              className='hover:underline hover:text-green-800 cursor-pointer'
            >
              Areas
            </span>
            <ChevronRight className='h-5 w-5'/>
            {formattedArea}
          </p>
        </div>
      </div>
    </DeanLayout>
  );
};

export default AreaParameters;
