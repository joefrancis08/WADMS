import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import ContentHeader from '../../components/Dean/ContentHeader';
import { ChevronRight, EllipsisVertical, Folder, Plus } from 'lucide-react';
import PATH from '../../constants/path';
import formatAreaName from '../../utils/formatAreaName';
import useAreaParameters from '../../hooks/Dean/useAreaParameters';
import ParameterModal from '../../components/Dean/ParameterModal';

const { PROGRAMS_TO_BE_ACCREDITED, PROGRAM_AREAS, PARAM_SUBPARAMS } = PATH.DEAN;

const AreaParameters = () => {
  const { 
    params,
    navigation, 
    refs, 
    datas, 
    modals, 
    inputs, 
    handlers 
  } = useAreaParameters();

  const { periodID, level, programID, areaID }  = params;
  const { navigate } = navigation;
  const { parameterInputRef } = refs;
  const { modalType } = modals;
  const { parameterInput } = inputs;
  const {
    levelName,
    programName,
    areaName,
    parameters,
    loading,
    error,
    parameterData,
    parametersArr,
    duplicateValues
  } = datas;
  const {
    handleCloseModal,
    handlePlusClick,
    handleParameterChange,
    handleAddParameterValue,
    handleRemoveParameterValue,
    handleSaveParameters
  } = handlers;

  return (
    <DeanLayout>
      <div className='flex-1'>
        <ContentHeader 
          headerIcon={Folder}
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
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              {levelName} - {programName}
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Areas'
              onClick={() => navigate(PROGRAM_AREAS({
                periodID,
                level,
                programID
              }))}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              {formatAreaName(areaName)}
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span className='font-semibold'>
              {parameterData.length > 1 ? 'Parameters' : 'Parameter'}
            </span>
          </p>
        </div>
        <div className='flex justify-end px-5 py-3'>
          <button
            onClick={handlePlusClick} 
            title='Add Parameters'
            className='cursor-pointer hover:opacity-80 active:opacity-50'>
            <Plus className='h-8 w-8' />
          </button>
        </div>
        <div className={`flex max-md:flex-col flex-wrap gap-y-2 p-2 mb-8 ${parameterData.length === 0 ? 'justify-center' : 'justify-evenly'}`}>
          {parameterData.length === 0 && (
            <p>
              No parameters to display for {formatAreaName(areaName)}.
            </p>
          )}
          {parameterData.map(({parameter_uuid, parameter}, index) => (
            <div
              onClick={() => navigate(PARAM_SUBPARAMS({ 
                periodID, 
                level, 
                programID, 
                areaID, 
                parameterID: parameter_uuid 
              }))}
              key={index} 
              className='relative flex items-center justify-start border py-5 px-2 h-20 w-100 max-md:w-full rounded-md transition-all cursor-pointer hover:bg-slate-50 active:opacity-50'
            >
              <Folder className='flex shrink-0 mr-2'/>
              <p className='pr-10'>
                {parameter}
              </p>
              <EllipsisVertical className='absolute top-1/2 right-3 -translate-y-1/2 flex shrink-0 ml-4 h-5 w-5' />
            </div>
          ))}
        </div>
      </div>
      <ParameterModal 
        modalType={modalType}
        refs={{ parameterInputRef }}
        inputs={{ parameterInput }}
        datas={{ parametersArr, duplicateValues }}
        handlers={{
          handleCloseModal,
          handleSaveParameters,
          handleAddParameterValue,
          handleRemoveParameterValue,
          handleParameterChange
        }}
      />
    </DeanLayout>
  );
};

export default AreaParameters;
