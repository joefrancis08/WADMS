import React, { useState, useMemo } from 'react';
import {
  File,
  FolderOpen,
  CirclePlus,
  Search,
  FolderPlus,
  Plus,
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
    accredInfoUUID,
    title,
    year,
    level,
    programUUID,
    program,
    areaUUID,
    area,
    paramUUID,
    paramName,
    subParamUUID,
    subParam,
    indicatorsData,
  } = datas;

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filteredIndicators = useMemo(() => {
    if (!searchQuery) return indicatorsData;
    const q = searchQuery.toLowerCase();
    return indicatorsData.filter(({ indicator }) =>
      indicator.toLowerCase().includes(q)
    );
  }, [searchQuery, indicatorsData]);

  const breadcrumbItems = [
    {
      label: `${title} ${year}`,
      onClick: () => {
        navigate(PATH.TASK_FORCE.ACCREDITATION);
      },
    },
    {
      label: program,
      onClick: () => {
        navigate(PATH.TASK_FORCE.ACCREDITATION);
      },
    },
    {
      label: formatAreaName(area),
      onClick: () => {
        navigate(PATH.TASK_FORCE.PROGRAM_AREAS(programUUID));
      },
    },
    {
      label: paramName,
      onClick: () => {
        navigate(PATH.TASK_FORCE.AREA_PARAMETERS(areaUUID));
      },
    },
    {
      label: subParam,
      onClick: () => {
        navigate(PATH.TASK_FORCE.PARAM_SUBPARAMS(paramUUID));
      },
    },
    { label: 'Indicators', isActive: true },
  ];

  return (
    <TaskForceLayout>
      <div className='flex-1 bg-slate-50'>
        {/* ===== Sticky Header ===== */}
        <div className='sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur'>
          <div className='mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between'>
            <Breadcrumb items={breadcrumbItems} />

            {/* Search + Add */}
            <div className='relative flex w-full items-center gap-2 md:w-[30rem]'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search indicator...'
                className='w-full rounded-full border border-slate-300 bg-white px-10 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-400'
              />
              <button
                title='Add new indicator'
                onClick={() => setModalOpen(true)}
                className='inline-flex min-w-32 cursor-pointer items-center justify-center gap-1 rounded-full bg-emerald-600 px-4 py-2 text-white shadow-sm ring-1 ring-emerald-300 transition hover:bg-emerald-500 active:scale-95'
              >
                <FolderPlus className='h-5 w-5' />
                <span className='text-sm font-medium'>Add New</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== Program Header ===== */}
        <div className='mx-auto mt-6 flex w-[85%] items-center justify-center md:mt-8 md:w-[75%] lg:w-[50%]'>
          <p className='relative mb-8 text-center'>
            <span className='text-lg font-bold tracking-wide text-emerald-800 md:text-2xl lg:text-2xl'>
              {program}
            </span>
            <span className='absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-full bg-emerald-700 px-4 py-1 text-sm font-bold text-white md:text-sm'>
              {level} • {formatAreaName(area)} •{' '}
              {formatSubparameter('Parameter', subParam)}
            </span>
          </p>
        </div>

        {/* ===== Indicators Grid ===== */}
        <div className='mx-auto mb-10 max-w-7xl px-4'>
          <div
            className={`flex flex-wrap justify-center gap-6 rounded py-4 ${
              filteredIndicators.length ? 'items-start' : 'items-center'
            }`}
          >
            {/* Empty State */}
            {!filteredIndicators.length && (
              <div className='flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm'>
                <FolderOpen className='h-24 w-24 text-slate-400' />
                <p className='mt-4 text-base font-medium text-slate-700'>
                  {indicatorsData.length === 0
                    ? `No indicators yet for ${subParam}. Click “Add New” to create one.`
                    : `No indicators found for “${searchQuery}”.`}
                </p>
                <div className='mt-4'>
                  <button
                    onClick={() => setModalOpen(true)}
                    className='flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 bg-slate-900/90 px-5 py-2 text-white shadow transition hover:border-emerald-500 hover:bg-slate-900 active:scale-95'
                  >
                    <Plus className='h-5 w-5' />
                    <span className='text-sm font-medium'>Add</span>
                  </button>
                </div>
              </div>
            )}

            {/* Indicator Cards */}
            {filteredIndicators.map(({ indicator_uuid, indicator }) => (
              <div
                key={indicator_uuid}
                className='relative flex flex-col items-center justify-center w-full max-w-[380px] cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md'
              >
                <File className='h-10 w-10 text-emerald-700 mb-2' />
                <p className='text-center font-medium text-slate-800'>{indicator}</p>
              </div>
            ))}

            {/* Add Indicator Card */}
            {filteredIndicators.length > 0 && (
              <div
                onClick={() => setModalOpen(true)}
                className='flex flex-col items-center justify-center w-full max-w-[380px] cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 active:scale-95'
              >
                <CirclePlus className='h-10 w-10 text-emerald-600 mb-2' />
                <p className='font-medium'>Add Indicator</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Modal ===== */}
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
