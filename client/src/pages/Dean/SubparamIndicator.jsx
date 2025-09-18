import React from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import ContentHeader from '../../components/Dean/ContentHeader';
import { ChevronRight, EllipsisVertical, File, FileStack, Plus } from 'lucide-react';
import useSubparamIndicators from '../../hooks/Dean/useSubparamIndicators';
import PATH from '../../constants/path';
import IndicatorModal from '../../components/Dean/IndicatorModal';

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
    loading,
    error,
    refetch
  } = datas;

  const {
    handleCloseModal,
    handleAddIndClick,
    handleIndicatorChange,
    handleAddIndicatorValue,
    handleRemoveIndicatorValue
  } = handlers;

  return (
    <DeanLayout>
      <div className='flex-1'>
        <ContentHeader 
          headerIcon={FileStack}
          headerTitle={'Indicators'}
          searchTitle={'Search indicator'}
          placeholder={'Search indicator...'}
          condition={true}
        />

        <div className='flex justify-between px-4 pt-4'>
          <p className='flex flex-row items-center'>
            <span 
              title='Back to Programs'
              onClick={() => navigate(PROGRAMS_TO_BE_ACCREDITED)}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              Programs
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Areas'
              onClick={() => navigate(PROGRAM_AREAS({
                accredInfoUUID,
                level,
                programUUID
              }))}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              Areas
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Parameters'
              onClick={() => navigate(AREA_PARAMETERS({
                accredInfoUUID,
                level,
                programUUID,
                areaUUID
              }))}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              Parameters
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Parameters'
              onClick={() => navigate(PARAM_SUBPARAMS({
                accredInfoUUID,
                level,
                programUUID,
                areaUUID,
                parameterUUID
              }))}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              Sub-Parameters
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span className='font-semibold'>
              {'Indicators'}
            </span>
          </p>
        </div>

        <div className='flex justify-end px-5 py-3'>
          <button
            onClick={handleAddIndClick} 
            title='Add Sub-Parameters'
            className='cursor-pointer hover:opacity-80 active:opacity-50'>
            <Plus className='h-8 w-8' />
          </button>
        </div>
        <div className={`flex max-md:flex-col flex-wrap gap-y-2 p-2 mb-8 ${indicatorsArr.length === 0 ? 'justify-center' : 'justify-evenly'}`}>
          {indicatorsArr.length === 0 && (
            <p>
              No indicators to display for {subParam}.
            </p>
          )}
          {indicatorsArr.map(({ indicator_uuid, indicator }) => (
            <div
              onClick={null}
              key={indicator_uuid} 
              className='relative flex items-center justify-start border py-5 px-2 h-20 w-100 max-md:w-full rounded-md transition-all cursor-pointer hover:bg-slate-50 active:opacity-50'
            >
              <File className='flex shrink-0 mr-2'/>
              <p className='pr-10'>
                {indicator}
              </p>
              <EllipsisVertical className='absolute top-1/2 right-3 -translate-y-1/2 flex shrink-0 ml-4 h-5 w-5' />
            </div>
          ))}
        </div>
      </div>
      <IndicatorModal 
        refs={{
          indicatorInputRef
        }}
        datas={{
          modalType,
          indicatorInput,
          inputtedIndicators,
          duplicateValues
        }}
        handlers={{
          handleCloseModal,
          handleIndicatorChange,
          handleAddIndicatorValue,
          handleRemoveIndicatorValue
        }}
      />
    </DeanLayout>
  );
};

export default SubparamIndicator
