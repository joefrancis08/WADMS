import React, { useState, useMemo } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import {
  File,
  FolderOpen,
  Plus,
  CirclePlus,
  Search,
  FolderPlus,
} from 'lucide-react';
import useSubparamIndicators from '../../hooks/Dean/useSubparamIndicators';
import PATH from '../../constants/path';
import IndicatorModal from '../../components/Dean/Accreditation/Indicator/IndicatorModal';
import formatAreaName from '../../utils/formatAreaName';
import formatParameterName from '../../utils/formatParameterName';
import Breadcrumb from '../../components/Breadcrumb';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import formatSubparameter from '../../utils/formatSP';

const {
  PROGRAMS_TO_BE_ACCREDITED,
  PROGRAM_AREAS,
  AREA_PARAMETERS,
  PARAM_SUBPARAMS,
} = PATH.DEAN;

const SubparamIndicator = () => {
  const { navigate, refs, params, datas, handlers } = useSubparamIndicators();
  const { indicatorInputRef } = refs;

  const {
    accredInfoUUID,
    level,
    programUUID,
    areaUUID,
    parameterUUID,
    subParameterUUID,
  } = params;

  const {
    modalType,
    indicatorInput,
    inputtedIndicators,
    duplicateValues,
    subParam,
    indicatorsArr,
    indicatorsBySubparamIdData,
    loading,
    error,
    refetch,
    program,
    area,
    parameter,
    levelName,
    title,
    year,
  } = datas;

  const {
    handleCloseModal,
    handleAddIndClick,
    handleIndicatorChange,
    handleAddIndicatorValue,
    handleRemoveIndicatorValue,
    handleSaveIndicators,
  } = handlers;

  // --- Search handling ---
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);
  const lowerQ = debouncedQuery.toLowerCase();

  const filteredIndicators = useMemo(() => {
    if (!lowerQ) return indicatorsArr;
    return indicatorsArr.filter(({ indicator }) =>
      indicator.toLowerCase().includes(lowerQ)
    );
  }, [indicatorsArr, lowerQ]);

  // --- Breadcrumbs ---
  const breadcrumbItems = [
    {
      label: `${title} ${year}`,
      onClick: () => {
        localStorage.removeItem('modal-type');
        localStorage.removeItem('modal-data');
        localStorage.removeItem('lastProgramId');
        localStorage.setItem('accreditation-title', `${title} ${year}`);
        navigate(PROGRAMS_TO_BE_ACCREDITED);
      },
    },
    {
      label: program,
      onClick: () => {
        localStorage.removeItem('accreditation-title');
        navigate(PATH.DEAN.PROGRAMS_TO_BE_ACCREDITED);
      },
    },
    {
      label: formatAreaName(area),
      onClick: () => navigate(PROGRAM_AREAS({ accredInfoUUID, level, programUUID })),
    },
    {
      label: parameter,
      onClick: () =>
        navigate(AREA_PARAMETERS({ accredInfoUUID, level, programUUID, areaUUID })),
    },
    {
      label: subParam,
      onClick: () =>
        navigate(
          PARAM_SUBPARAMS({ accredInfoUUID, level, programUUID, areaUUID, parameterUUID })
        ),
    },
    {
      label: 'Indicators',
      isActive: true,
    },
  ];

  return (
    <DeanLayout>
      <div className='flex-1 bg-slate-50'>
        {/* ===== Sticky Header ===== */}
        <div className='sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur'>
          <div className='mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between'>
            <Breadcrumb items={breadcrumbItems} />

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
                onClick={handleAddIndClick}
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
              {levelName} • {formatAreaName(area)} • {formatSubparameter('Parameter', subParam)}
            </span>
          </p>
        </div>

        {/* ===== Indicator Cards Grid ===== */}
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
                  {indicatorsArr.length === 0
                    ? `No indicators yet for ${subParam}. Click “Add New” to create one.`
                    : `No indicators found for “${searchQuery}”.`}
                </p>
                <div className='mt-4'>
                  <button
                    onClick={handleAddIndClick}
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
                onClick={handleAddIndClick}
                className='flex flex-col items-center justify-center w-full max-w-[380px] cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 active:scale-95'
              >
                <CirclePlus className='h-10 w-10 text-emerald-600 mb-2' />
                <p className='font-medium'>Add Indicator</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Indicator Modal ===== */}
      <IndicatorModal
        refs={{ indicatorInputRef }}
        datas={{
          modalType,
          indicatorInput,
          inputtedIndicators,
          duplicateValues,
          indicatorsBySubparamIdData,
        }}
        handlers={{
          handleCloseModal,
          handleIndicatorChange,
          handleAddIndicatorValue,
          handleRemoveIndicatorValue,
          handleSaveIndicators,
        }}
      />
    </DeanLayout>
  );
};

export default SubparamIndicator;
