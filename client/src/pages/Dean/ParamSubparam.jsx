import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { ChevronRight, EllipsisVertical, File, FileStack, Plus } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import formatParameterName from '../../utils/formatParameterName';
import useParamSubparam from '../../hooks/Dean/useParamSubparam';
import PATH from '../../constants/path';
import formatAreaName from '../../utils/formatAreaName';
import SubParamModal from '../../components/Dean/SubParamModal';

const { PROGRAMS_TO_BE_ACCREDITED, AREA_PARAMETERS, PROGRAM_AREAS } = PATH.DEAN;

const ParamSubparam = () => {
  const { navigate,  modalType,  refs,  params, datas, handlers } = useParamSubparam();

  const { subParamInputRef } = refs;
  const { 
    accredInfoUUID,
    level,
    programUUID,
    areaUUID,
    parameterUUID
  } = params;
  const {
    loading,
    error,
    refetch,
    levelName,
    program,
    area,
    parameter,
    subParamsData,
    subParameterInput,
    subParamsArr,
    duplicateValues,
  } = datas;
  const {
    handleSubparamCardClick,
    handleCloseModal,
    handleSubParamChange,
    handleAddSubParamValue,
    handleRemoveSubParamValue,
    handleSaveSubParams
  } = handlers;

  return (
    <DeanLayout>
      <div className='flex-1'>
        <ContentHeader 
          headerIcon={FileStack}
          headerTitle={'Sub-Parameters'}
          searchTitle={'Search sub-parameter'}
          placeholder={'Search sub-parameter...'}
          condition={false}
        />

        <div className='flex justify-between px-4 pt-4'>
          <p className='flex flex-row items-center'>
            <span 
              title='Back to Programs'
              onClick={() => navigate(PROGRAMS_TO_BE_ACCREDITED)}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              {levelName} - {program}
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
              {formatAreaName(area)}
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
              Parameter {formatParameterName(parameter)}
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span className='font-semibold'>
              {subParamsData.length > 1 ? 'Sub-Parameters' : 'Sub-Parameter'}
            </span>
          </p>
        </div>

        <div className='flex justify-end px-5 py-3'>
          <button
            onClick={handleSubparamCardClick} 
            title='Add Sub-Parameters'
            className='cursor-pointer hover:opacity-80 active:opacity-50'>
            <Plus className='h-8 w-8' />
          </button>
        </div>
        <div className={`flex max-md:flex-col flex-wrap gap-y-2 p-2 mb-8 ${subParamsData.length === 0 ? 'justify-center' : 'justify-evenly'}`}>
          {subParamsData.length === 0 && (
            <p>
              No sub-parameters to display for Parameter {formatParameterName(parameter)}.
            </p>
          )}
          {subParamsData.map(({sub_parameter_uuid, sub_parameter}) => (
            <div
              onClick={(null)}
              key={sub_parameter_uuid} 
              className='relative flex items-center justify-start border py-5 px-2 h-20 w-100 max-md:w-full rounded-md transition-all cursor-pointer hover:bg-slate-50 active:opacity-50'
            >
              <File className='flex shrink-0 mr-2'/>
              <p className='pr-10'>
                {sub_parameter}
              </p>
              <EllipsisVertical className='absolute top-1/2 right-3 -translate-y-1/2 flex shrink-0 ml-4 h-5 w-5' />
            </div>
          ))}
        </div>
      </div>
      <SubParamModal 
        modalType={modalType}
        refs={{ subParamInputRef }}
        datas={{ 
          subParamsArr,
          subParameterInput,
          duplicateValues 
        }}
        handlers={{
          handleCloseModal,
          handleSaveSubParams,
          handleAddSubParamValue,
          handleRemoveSubParamValue,
          handleSubParamChange
        }}
      />
    </DeanLayout>
  );
};

export default ParamSubparam
