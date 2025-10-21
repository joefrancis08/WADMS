import React, { useState, useMemo } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import {
  File,
  FolderOpen,
  Plus,
  CirclePlus,
  Search
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
  PARAM_SUBPARAMS
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
    subParameterUUID
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
    year
  } = datas;

  const {
    handleCloseModal,
    handleAddIndClick,
    handleIndicatorChange,
    handleAddIndicatorValue,
    handleRemoveIndicatorValue,
    handleSaveIndicators
  } = handlers;

  // 🧠 SEARCH STATE
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);
  const lowerQ = debouncedQuery.toLowerCase();

  // Filter indicators by query
  const filteredIndicators = useMemo(() => {
    if (!lowerQ) return indicatorsArr;
    return indicatorsArr.filter(({ indicator }) =>
      indicator.toLowerCase().includes(lowerQ)
    );
  }, [indicatorsArr, lowerQ]);

  // Breadcrumbs
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
      onClick: () => navigate(AREA_PARAMETERS({ accredInfoUUID, level, programUUID, areaUUID })),
    },
    {
      label: subParam,
      onClick: () => navigate(PARAM_SUBPARAMS({ accredInfoUUID, level, programUUID, areaUUID, parameterUUID })),
    },
    {
      label: filteredIndicators.length > 1 ? 'Indicators' : 'Indicator',
      isActive: true,
    },
  ];

  return (
    <DeanLayout>
      <div className='flex-1 p-3'>
        {/* Main Container */}
        <div className='bg-slate-900 m-2 pb-2 border border-slate-700 rounded-lg'>
          {/* Header Section: Breadcrumb + Search */}
          <div className='flex flex-col md:flex-row md:items-center md:justify-between shadow px-4 pt-4 bg-black/40 p-4 rounded-t-lg gap-4'>
            <Breadcrumb items={breadcrumbItems} />

            {/* Search bar */}
            <div className='relative w-full md:w-1/3 lg:w-1/4'>
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

          {/* Program and Level Display */}
          <div className='flex items-center justify-center mt-4 max-md:mt-10 w-auto mx-auto mb-8'>
            <p className='relative text-center gap-2 w-full'>
              <span className='text-yellow-400 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide'>
                {program}
              </span>
              <span className='absolute -bottom-10 right-1/2 translate-x-1/2 text-xs md:text-lg px-6 bg-green-700 text-white font-medium'>
                {levelName} &#8226; {formatAreaName(area)} &#8226; {formatSubparameter('Parameter', subParam)}
              </span>
            </p>
          </div>

          {/* Indicators List */}
          <div className={`flex flex-wrap gap-8 justify-center mb-8 py-8 px-2 mx-2 rounded ${filteredIndicators.length ? 'items-start' : 'items-center'}`}>
            {/* Empty state */}
            {filteredIndicators.length === 0 && (
              <div className='flex flex-col items-center justify-center'>
                <FolderOpen className='text-slate-600' size={200} />
                <p className='text-lg font-medium text-slate-200'>
                  {indicatorsArr.length === 0
                    ? `No indicators to display for ${subParam}.`
                    : `No indicators found for “${searchQuery}”.`}
                </p>
                {/* Add Indicator Button */}
                <div className='max-md:hidden flex justify-end px-5 p-2 mt-3'>
                  <button
                    onClick={handleAddIndClick}
                    className='flex gap-x-1 text-white text-sm lg:text-base justify-center items-center cursor-pointer rounded-full px-5 py-2 hover:opacity-90 active:scale-98 border-3 border-slate-500 bg-slate-700/50 shadow hover:shadow-md hover:border-green-600 transition'
                  >
                    <Plus className='h-6 w-6' />
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Indicator Cards */}
            {filteredIndicators.map(({ indicator_uuid, indicator }) => (
              <div
                key={indicator_uuid}
                className='relative flex flex-col items-center justify-center border border-slate-700 hover:scale-102 hover:shadow shadow-slate-600 p-4 rounded-md transition cursor-pointer bg-slate-800 active:opacity-90 w-[45%] py-12 text-slate-100 active:scale-98'
              >
                <File className='h-12 w-12 flex shrink-0 mb-2' />
                <p className='text-center font-medium'>{indicator}</p>
              </div>
            ))}

            {/* Add Indicator Card */}
            {filteredIndicators.length > 0 && (
              <div
                onClick={handleAddIndClick}
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
          handleSaveIndicators
        }}
      />
    </DeanLayout>
  );
};

export default SubparamIndicator;
