import React, { useState, useMemo } from 'react'
import {
  File,
  FolderOpen,
  Plus,
  CirclePlus,
  Search,
  FolderPlus
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import IndicatorModal from '../../components/Dean/Accreditation/Indicator/IndicatorModal';
import TaskForceLayout from '../../components/Layout/Task-Force/TaskForceLayout';
import useSubparamIndicator from '../../hooks/Task Force/useSubparamIndicator';
import formatAreaName from '../../utils/formatAreaName';
import PATH from '../../constants/path';
import formatSubparameter from '../../utils/formatSP';
import formatParameterName from '../../utils/formatParameterName';

const SubparamIndicator = () => {
  const { navigate, datas } = useSubparamIndicator();
  const { 
    accredInfoUUID, title, year, level, 
    programUUID, program, areaUUID, area,
    paramUUID, paramName, subParamUUID, 
    subParam, indicatorsData
  } = datas;
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filteredIndicators = useMemo(() => {
    if (!searchQuery) return indicatorsData;
    const q = searchQuery.toLowerCase()
    return indicatorsData.filter(({ indicator }) =>
      indicator.toLowerCase().includes(q)
    )
  }, [searchQuery, indicatorsData]);

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
        navigate(PATH.TASK_FORCE.ACCREDITATION);
      } 
    },
    { 
      label: formatAreaName(area), 
      onClick: () => {
        navigate(PATH.TASK_FORCE.PROGRAM_AREAS(programUUID));
      } 
    },
    { 
      label: paramName, 
      onClick: () => {
        navigate(PATH.TASK_FORCE.AREA_PARAMETERS(areaUUID));
      } 
    },
    { 
      label: subParam, 
      onClick: () => {
        navigate(PATH.TASK_FORCE.PARAM_SUBPARAMS(paramUUID));
      } 
    },
    { label: 'Indicators', isActive: true },
  ];

  return (
    <TaskForceLayout>
      <div className='flex-1 p-3'>
        <div className='bg-slate-900 m-2 pb-2 border border-slate-700 rounded-lg'>
          {/* Header Section */}
          <div className='sticky top-0 z-40 flex flex-col md:flex-row md:items-center md:justify-between shadow px-4 pt-4 bg-slate-900 p-4 rounded-t-lg gap-4 border-b border-slate-700'>
            <Breadcrumb items={breadcrumbItems} />
            <div className='relative flex items-center gap-x-2 w-full md:w-1/4'>
              <Search className='absolute left-3 top-2.5 h-5 w-5 text-slate-400' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search indicator...'
                className='pl-10 pr-3 py-2 rounded-full bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-full transition-all'
              />
            </div>
          </div>

          {/* Program + Level Display */}
          <div className='flex items-center justify-center mt-4 max-md:mt-10 w-auto mx-auto mb-8'>
            <p className='relative text-center gap-2 w-full'>
              <span className='text-yellow-400 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide'>
                {program}
              </span>
              <span className='absolute -bottom-6 right-1/2 translate-x-1/2 text-xs md:text-sm px-6 text-slate-200'>
                {level} &bull; {formatAreaName(area)} &bull; {formatSubparameter('Parameter', subParam)}
              </span>
            </p>
          </div>

          {/* Indicators List */}
          <div
            className={`flex flex-wrap gap-8 justify-center mb-8 py-8 px-2 mx-2 rounded ${
              filteredIndicators.length ? 'items-start' : 'items-center'
            }`}
          >
            {!filteredIndicators.length && (
              <div className='flex flex-col items-center justify-center'>
                <FolderOpen className='text-slate-600' size={200} />
                <p className='text-lg font-medium text-slate-200'>
                  No indicators to show.
                </p>
              </div>
            )}

            {filteredIndicators.map(({ indicator_uuid, indicator }) => (
              <div
                key={indicator_uuid}
                className='relative flex flex-col items-center justify-center border border-slate-700 hover:scale-102 hover:shadow shadow-slate-600 p-4 rounded-md transition cursor-pointer bg-slate-800 active:opacity-90 w-[45%] py-12 text-slate-100 active:scale-98'
              >
                <File className='h-12 w-12 flex shrink-0 mb-2' />
                <p className='text-center font-medium'>{indicator}</p>
              </div>
            ))}

            {filteredIndicators.length > 0 && (
              <div
                onClick={() => setModalOpen(true)}
                className='flex flex-col gap-y-2 items-center justify-center border border-slate-700 hover:scale-102 hover:shadow shadow-slate-600 p-4 rounded-md transition cursor-pointer bg-slate-800 active:opacity-90 w-[45%] py-12 text-slate-100 active:scale-98'
              >
                <CirclePlus className='h-12 w-12 flex shrink-0' />
                <p>Add Indicator</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Indicator Modal */}
      {modalOpen && (
        <IndicatorModal
          datas={{
            modalType: 'add',
            indicatorInput: '',
            inputtedIndicators: [],
            duplicateValues: [],
            indicatorsBySubparamIdData: [],
          }}
          handlers={{
            handleCloseModal: () => setModalOpen(false),
            handleIndicatorChange: () => {},
            handleAddIndicatorValue: () => {},
            handleRemoveIndicatorValue: () => {},
            handleSaveIndicators: () => setModalOpen(false),
          }}
        />
      )}
    </TaskForceLayout>
  );
};

export default SubparamIndicator;
