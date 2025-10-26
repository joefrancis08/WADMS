import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  Plus,
  Search,
  FileUser,
  EllipsisVertical,
  FolderPlus,
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import ProgressBar from '../../components/ProgressBar';
import ProfileStack from '../../components/ProfileStack';
import TaskForceLayout from '../../components/Layout/Task-Force/TaskForceLayout';
import useAreaParameters from '../../hooks/Task Force/useAreaParameters';
import formatAreaName from '../../utils/formatAreaName';
import formatParameter from '../../utils/formatParameter';
import PATH from '../../constants/path';

const AreaParameters = () => {
  const { navigate, datas, handlers } = useAreaParameters();
  const { 
    title, year, accredBody, level,
    programUUID, program, area, parameters 
  } = datas;
  const { handleParamCardClick } = handlers;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeParamId, setActiveParamId] = useState(null);

  const filteredParameters = useMemo(() => {
    if (!searchQuery) return parameters;
    const q = searchQuery.toLowerCase();
    return parameters.filter((p) => p.parameter.toLowerCase().includes(q));
  }, [searchQuery, parameters]);

  const breadcrumbItems = [
    { 
      label: `${title} ${year}`, 
      onClick: () => {
        navigate(PATH.TASK_FORCE.ACCREDITATION);
      } 
    },
    { 
      label: program, 
      onClick: () => {
        navigate(PATH.TASK_FORCE.ACCREDITATION)
      } 
    },
    { 
      label: formatAreaName(area), 
      onClick: () => {
        navigate(PATH.TASK_FORCE.PROGRAM_AREAS(programUUID))
      } 
    },
    { 
      label: 'Parameters', 
      isActive: true 
    },
  ];

  return (
    <TaskForceLayout>
      <div className='flex-1 p-3'>
        <div className='bg-slate-900 m-2 pb-2 border border-slate-700 rounded-lg'>
          {/* Header */}
          <div className='sticky top-0 z-40 flex flex-col md:flex-row md:items-center md:justify-between shadow px-4 pt-4 bg-slate-900 p-4 rounded-t-lg gap-4 border-b border-slate-700'>
            <Breadcrumb items={breadcrumbItems} />
            <div className='relative flex items-center gap-x-2 w-full md:w-1/4'>
              <Search className='absolute left-3 top-2.5 h-5 w-5 text-slate-400' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search parameter...'
                className='pl-10 pr-3 py-2 rounded-full bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-full transition-all'
              />
            </div>
          </div>

          {/* Program + Area */}
          <div className='flex items-center justify-center mt-6 mb-8 w-auto mx-auto'>
            <p className='relative text-center w-full'>
              <span className='text-yellow-400 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide'>
                {program}
              </span>
              <span className='absolute -bottom-5 right-1/2 translate-x-1/2 text-xs md:text-sm px-6 text-slate-200'>
                {level} &bull; {formatAreaName(area)}
              </span>
            </p>
          </div>

          {/* Parameters */}
          <div className={`flex flex-wrap gap-8 justify-center mb-8 py-8 px-4 mx-2 rounded ${filteredParameters.length ? 'items-start' : 'items-center'}`}>
            {!filteredParameters.length && (
              <div className='flex flex-col items-center justify-center text-center'>
                <FolderOpen className='text-slate-600' size={160} />
                <p className='text-lg font-medium text-slate-300 mt-2'>No parameters found.</p>
              </div>
            )}

            {filteredParameters.map((param) => {
              const { label, content } = formatParameter(param.parameter);
              console.log(param);
              return (
              <div
                key={param.parameter_uuid}
                onClick={() => handleParamCardClick(param.parameter_uuid)}
                className='flex flex-col mb-8 justify-between border border-slate-600 hover:shadow-lg hover:cursor-pointer shadow-slate-800 transition rounded-md bg-slate-800 p-5 w-full h-45 sm:w-[45%] lg:w-[30%] relative active:scale-98'
              >
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold text-lg text-slate-300'>{label}</h3>
                </div>
                <p className='text-white text-xl font-semibold mt-2 truncate'>{content}</p>
                <hr className='text-slate-700 my-8' />
              </div>
            )})}
          </div>
        </div>
      </div>
    </TaskForceLayout>
  );
};

export default AreaParameters;