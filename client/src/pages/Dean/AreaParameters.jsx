import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { ChevronRight, EllipsisVertical, Folder, Plus } from 'lucide-react';
import PATH from '../../constants/path';
import formatAreaName from '../../utils/formatAreaName';
import useAreaParameters from '../../hooks/Dean/useAreaParameters';
import ParameterModal from '../../components/Dean/Accreditation/Parameter/ParameterModal';
import formatParameter from '../../utils/formatParameter';

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

  const { accredInfoUUID, level, programUUID, areaUUID }  = params;
  const { navigate } = navigation;
  const { parameterInputRef } = refs;
  const { modalType } = modals;
  const { parameterInput } = inputs;
  const { 
    parameterData, parametersArr, duplicateValues, title, 
    year, area, program, levelName 
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
      <div className='flex-1 p-3'>
        {/* Breadcrumb Header */}
        <div className='bg-slate-100 m-2 pb-2 shadow-md shadow-slate-400'>
          <div className='flex justify-between shadow px-4 pt-4 bg-slate-200 p-4'>
            <p className='flex flex-row items-center text-sm gap-1'>
              <span 
                title='Back to Programs'
                onClick={() => navigate(PROGRAMS_TO_BE_ACCREDITED)}
                className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
              >
                {`${title} ${year}`}
              </span>
              <ChevronRight className='h-4 w-4 text-slate-500'/>
              <span 
                title='Back to Programs'
                onClick={() => navigate(PROGRAMS_TO_BE_ACCREDITED)}
                className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
              >
                {program}
              </span>
              <ChevronRight className='h-4 w-4 text-slate-500'/>
              <span
                title='Back to Areas'
                onClick={() => navigate(PROGRAM_AREAS({ accredInfoUUID, level, programUUID }))}
                className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
              >
                Areas
              </span>
              <ChevronRight className='h-4 w-4 text-slate-500'/>
              <span className='font-semibold text-lg'>{parameterData.length > 1 ? 'Parameters' : 'Parameter'}</span>
            </p>
          </div>
          {/* Program and Level Display */}
          <div className='flex items-center justify-center mt-4 max-md:mt-10 w-[85%] md:w-[75%] lg:w-[50%] mx-auto'>
            <p className='relative text-center'>
              <span className='text-green-600 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide'>
                {program}
              </span>
              <span className='absolute -bottom-10 left-1/2 -translate-x-1/2 text-lg px-4 bg-yellow-400 text-white font-bold'>
                {formatAreaName(area)}
              </span>
            </p>
          </div>
          <hr className='mt-6 w-[30%] mx-auto border text-green-500' />

          {/* Add Parameter Button */}
          <div className='max-md:hidden flex justify-end px-5 p-2'>
            <button
              onClick={handlePlusClick}
              className='flex gap-2 text-white text-sm lg:text-base justify-center items-center cursor-pointer rounded-full px-4 py-2 hover:opacity-90 active:opacity-80 bg-green-600 shadow hover:shadow-md'
            >
              <Plus className='h-6 w-6' />
              Add Parameter
            </button>
          </div>

          {/* Parameters List */}
          <div className={`flex flex-wrap gap-8 justify-center mb-8 py-8 px-2 mx-2 rounded ${parameterData.length ? 'items-start' : 'items-center'}`}>
            {!parameterData.length && (
              <div className='flex flex-col items-center justify-center'>
                <Folder className='text-slate-600' size={200}/>
                <p className='text-xl font-medium text-slate-800'>No parameters to display for {formatAreaName(area)}.</p>
              </div>
            )}

            {parameterData.map(({ parameter_uuid, parameter }) => {
              const { label, content } = formatParameter(parameter);

              return (
                <div
                  key={parameter_uuid}
                  onClick={() => navigate(PARAM_SUBPARAMS({ 
                    accredInfoUUID, 
                    level, 
                    programUUID, 
                    areaUUID, 
                    parameterUUID: parameter_uuid 
                  }))}
                  className='relative flex flex-col items-start justify-center px-4 max-sm:w-full md:w-75 lg:w-50 h-48 bg-[url("/cgs-bg-2.png")] bg-cover bg-center shadow-slate-400 shadow hover:shadow-lg transition-all cursor-pointer active:shadow'
                >
                  <div className='absolute inset-0 bg-black/50'></div>
                  <div className='flex flex-col items-center justify-center z-20 w-full h-full'>
                    <span className='text-white bg-yellow-400 min-w-12 text-center font-bold text-md md:text-lg mt-4'>
                      {label}
                    </span>
                    <span className='text-white text-lg md:text-xl text-center font-semibold'>
                      {content}
                    </span>
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    title='Options'
                    className='absolute top-2 right-2 text-white cursor-pointer active:opacity-50 rounded-full hover:bg-yellow-400/50 p-2 z-40'
                  >
                    <EllipsisVertical className='h-5 w-5' />
                  </button>
                </div>
              );
            })}
          </div>
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
