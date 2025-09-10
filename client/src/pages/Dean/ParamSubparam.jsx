import React, { useState } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { ChevronRight, EllipsisVertical, File, FileStack, Plus } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import { useNavigate, useParams } from 'react-router-dom';
import PATH from '../../constants/path';
import formatProgramParams from '../../utils/formatProgramParams';
import formatAreaName from '../../utils/formatAreaName';
import useFetchProgramAreas from '../../hooks/fetch-react-query/useFetchProgramAreas';
import useFetchAreaParameters from '../../hooks/fetch-react-query/useFetchAreaParameters';
import formatParameterName from '../../utils/formatParameterName';
import useFetchParamSubparam from '../../hooks/fetch-react-query/useFetchParamSubparam';
import MODAL_TYPE from '../../constants/modalTypes';
import SubParameterBaseModal from '../../components/Modals/accreditation/SubParameterBaseModal';
import AddField from '../../components/Form/Dean/AddField';
import useAutoFocus from '../../hooks/useAutoFocus';
import { addSubParams } from '../../api/accreditation/accreditationAPI';
import { showErrorToast, showSuccessToast } from '../../utils/toastNotification';
import { TOAST_MESSAGES } from '../../constants/messages';

const ParamSubparam = () => {
  const navigate = useNavigate();
  const { period, level, program, area, parameter } = useParams();

  const { PROGRAMS_TO_BE_ACCREDITED, AREA_PARAMETERS, PROGRAM_AREAS } = PATH.DEAN;
  const { SUBPARAMETER_ADDITION } = TOAST_MESSAGES;

  const { startDate, endDate, level: formattedLevel, program: formattedProgram} = formatProgramParams(period, level, program);

  const { areas: areasData } = useFetchProgramAreas(
    startDate, 
    endDate, 
    formattedLevel, 
    formattedProgram
  );

  const data = areasData.data ?? [];

  const areaObj = data.find(d => d.area_uuid === area) ?? null;
  const areaName = areaObj ? areaObj.area : 'Unknown area';

  const { parameters, loading: paramLoading, error: paramError, refetch: paramRefetch } = useFetchAreaParameters(
    startDate, 
    endDate, 
    formattedLevel, 
    formattedProgram, 
    areaName ?? ''
  );

  const parameterData = parameters.data ?? [];

  const parameterObj = parameterData.find(p => p.parameter_uuid === parameter) ?? null;
  const parameterName = parameterObj ? parameterObj.parameter : 'Unknown Parameter';

  const { subParameters, loading, error, refetch } = useFetchParamSubparam(
    startDate,
    endDate,
    formattedLevel,
    formattedProgram,
    areaName,
    parameterName
  );

  const subParamsData = subParameters.data ?? [];

  console.log(subParamsData);

  const [modalType, setModalType] = useState(null);
  const [subParameterInput, setSubParameterInput] = useState('');
  const [subParamsArr, setSubParamsArr] = useState([]);
  console.log(modalType);

  // Auto-focus on sub-parameter input
  const subParamInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_SUBPARAMETERS
  );

  const handleSubparamCardClick = () => {
    setModalType(MODAL_TYPE.ADD_SUBPARAMETERS);
  };

  const handleCloseModal = () => {
    setSubParamsArr([]);
    setModalType(null);
  };

  const handleSubParamChange = (e) => {
    setSubParameterInput(e.target.value)
  };

  const handleAddSubParamValue = (val) => {
    setSubParamsArr([...subParamsArr, val]);
  };

  const handleRemoveSubParamValue = (index) => {
    setSubParamsArr(subParamsArr.filter((_, i) => i !== index));
  };

  const handleSaveSubParams = async () => {
    try {
      const res = await addSubParams({
        startDate,
        endDate,
        levelName: formattedLevel,
        programName: formattedProgram,
        areaName,
        parameterName,
        subParameterNames: subParamsArr
      });

      if (res.data.success) {
        showSuccessToast(SUBPARAMETER_ADDITION.SUCCESS);
      }

      handleCloseModal();

    } catch (error) {
      if (error.response.data.isDuplicate) {
        showErrorToast('Duplicate entry.');
      }
    }
  };

  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPE.ADD_SUBPARAMETERS:
        return (
          <SubParameterBaseModal 
            onClose={handleCloseModal}
            onCancel={handleCloseModal}
            onSave={handleSaveSubParams}
            primaryButton={'Add Sub-Parameters'}
            disabled={false}
            secondaryButton={'Cancel'}
            mode={'Add'}
            headerContent={
              <div>
                <p className='text-xl font-semibold'>
                  Add Sub-Parameters
                </p>
              </div>
            }
            bodyContent={
              <div className='relative w-full'>
                <AddField
                  ref={subParamInputRef}
                  fieldName={'Sub-Parameters'}
                  placeholder={'Enter sub-parameters...'}
                  type='textarea'
                  name='subParamInput'
                  formValue={subParameterInput}
                  multiValue={true}
                  multiValues={subParamsArr}
                  // dropdownItems={data}
                  showDropdownOnFocus={true}
                  // duplicateValues={duplicateValues}
                  // onDropdownMenuClick={handleOptionSelection}
                  onAddValue={(val) => handleAddSubParamValue(val)}
                  onRemoveValue={(index) => handleRemoveSubParamValue(index)}
                  onChange={(e) => handleSubParamChange(e)}
                  // onFocus={handleFocus}
                />
              </div>
            }
          />
        );
    
      default:
        break;
    }
  }


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
              {formattedLevel} - {formattedProgram}
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Areas'
              onClick={() => navigate(PROGRAM_AREAS({
                period,
                level,
                program
              }))}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              {formatAreaName(areaName)}
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Parameters'
              onClick={() => navigate(AREA_PARAMETERS({
                period,
                level,
                program,
                area
              }))}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              Parameter {formatParameterName(parameterName)}
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span className='font-semibold'>
              {parameterData.length > 1 ? 'Sub-Parameters' : 'Sub-Parameter'}
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
              No sub-parameters to display for Parameter {formatParameterName(parameterName)}.
            </p>
          )}
          {subParamsData.map(({sub_parameter_uuid, sub_parameter}, index) => (
            <div
              onClick={(null)}
              key={index} 
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
      {renderModal()}
    </DeanLayout>
  );
};

export default ParamSubparam
