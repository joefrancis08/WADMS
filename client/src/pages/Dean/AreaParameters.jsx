import React, { useEffect, useRef, useState } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import ContentHeader from '../../components/Dean/ContentHeader';
import { ChevronRight, EllipsisVertical, Folder, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import formatProgramParams from '../../utils/formatProgramParams';
import PATH from '../../constants/path';
import useFetchProgramAreas from '../../hooks/fetch-react-query/useFetchProgramAreas';
import formatAreaName from '../../utils/formatAreaName';
import useFetchAreaParameters from '../../hooks/fetch-react-query/useFetchAreaParameters';
import MODAL_TYPE from '../../constants/modalTypes';
import AreaBaseModal from '../../components/Modals/accreditation/AreaBaseModal';
import ParameterBaseModal from '../../components/Modals/accreditation/ParameterBaseModal';
import AddField from '../../components/Form/Dean/AddField';
import useAutoFocus from '../../hooks/useAutoFocus';
import { addAreaParameters } from '../../api/accreditation/accreditationAPI';
import { showErrorToast, showSuccessToast } from '../../utils/toastNotification';
import { TOAST_MESSAGES } from '../../constants/messages';

const AreaParameters = () => {
  const navigate = useNavigate();
  const { period, level, program, area } = useParams();

  const { PROGRAMS_TO_BE_ACCREDITED } = PATH.DEAN;
  const { PARAMETER_ADDITION } = TOAST_MESSAGES;

  const [modalType, setModalType] = useState(null);

  const [parametersArr, setParametersArr] = useState([]);
  const [parameterInput, setParameterInput] = useState('');

  const { 
    startDate, 
    endDate, 
    level: formattedLevel, 
    program: formattedProgram,
  } = formatProgramParams(period, level, program);

  const { areas: areasData } = useFetchProgramAreas(
    startDate, 
    endDate, 
    formattedLevel, 
    formattedProgram
  );

  const data = areasData.data ?? [];

  const areaObj = data.find(d => d.area_uuid === area) ?? null;
  const areaName = areaObj ? areaObj.area : 'Unknown area';

  const { parameters, loading, error, refetch } = useFetchAreaParameters(
    startDate, 
    endDate, 
    formattedLevel, 
    formattedProgram, 
    areaName
  );

  const parameterData = parameters.data ?? [];

  // Auto-focus parameter input
  const parameterInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_PARAMETER
  );

  const handlePlusClick = () => {
    setModalType(MODAL_TYPE.ADD_PARAMETER);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setParametersArr([]);
  };

  const handleParameterChange = (e) => {
    setParameterInput(e.target.value);
  };

  const handleAddParameterValue = (val) => {
    setParametersArr([...parametersArr, val]);
  };

  const handleRemoveParameterValue = (index) => {
    setParametersArr(parametersArr.filter((_, i) => i !== index))
  };

  const handleSaveParameters = async () => {
    try {
      const res = await addAreaParameters({
        startDate,
        endDate,
        levelName: formattedLevel,
        programName: formattedProgram,
        areaName,
        parameterNames: parametersArr
      });

      if (res.data.success) {
        showSuccessToast(PARAMETER_ADDITION.SUCCESS);
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
      case MODAL_TYPE.ADD_PARAMETER:
        return (
          <ParameterBaseModal
            onClose={handleCloseModal}
            onCancel={handleCloseModal}
            onSave={handleSaveParameters}
            primaryButton={parametersArr.length > 1 ? 'Add Parameters' : 'Add Parameter'}
            disabled={parametersArr.length === 0}
            secondaryButton={'Cancel'}
            mode='add'
            headerContent={'Add Parameters'}
            bodyContent={
              <div className='relative w-full'>
                <AddField
                  ref={parameterInputRef}
                  fieldName={parametersArr.length > 1 ? 'Parameters' : 'Parameter'}
                  placeholder={'Enter a parameter...'}
                  type='textarea'
                  name='areaInput'
                  formValue={parameterInput}
                  multiValue={true}
                  multiValues={parametersArr}
                  // dropdownItems={areasArray}
                  showDropdownOnFocus={true}
                  // onDropdownMenuClick={handleOptionSelection}
                  onAddValue={(val) => handleAddParameterValue(val)}
                  onRemoveValue={(index) => handleRemoveParameterValue(index)}
                  onChange={(e) => handleParameterChange(e)}
                  // onFocus={handleFocus}
                />
              </div>
            }
          />
        );
        
    
      default:
        break;
    }
  };

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
              className='hover:underline hover:text-green-800 cursor-pointer'
            >
              {formattedLevel} - {formattedProgram}
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Areas'
              onClick={() => navigate(-1)}
              className='hover:underline hover:text-green-800 cursor-pointer'
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
        <div className={`flex max-md:flex-col gap-2 p-2 mb-8 ${parameterData.length === 0 ? 'justify-center' : 'justify-start'}`}>
          {parameterData.length === 0 && (
            <p>
              No parameters to display for {formatAreaName(areaName)}.
            </p>
          )}
          {parameterData.map(({parameter}, index) => (
            <div
              onClick={() => console.log(parameter)}
              key={index} 
              className='relative flex items-center justify-start border py-5 px-2 w-1/2 max-md:w-full rounded-md transition-all cursor-pointer hover:bg-slate-50 active:opacity-50'
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
      {renderModal()}
    </DeanLayout>
  );
};

export default AreaParameters;
