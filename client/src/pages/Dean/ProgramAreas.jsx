import React from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { useNavigate, useParams } from 'react-router-dom';
import formatProgramParams from '../../utils/formatProgramParams';

const ProgramAreas = () => {
  const navigate = useNavigate();
  const { period, level, program } = useParams();
  const { 
    startDate, 
    endDate, 
    level: formattedLevel, 
    program: formattedProgram  
  } = formatProgramParams(period, level, program);

  console.log({
    startDate,
    endDate, 
    level: formattedLevel,
    program: formattedProgram
  });

  return (
    <DeanLayout>
      <div>
        <div>
          <p>
            <span onClick={() => navigate(-1)}>
              {formattedLevel}
            </span> - {formattedProgram}</p>
        </div>
      </div>
    </DeanLayout>
  );
};

export default ProgramAreas;
