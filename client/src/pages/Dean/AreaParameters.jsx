import React, { useState } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import ContentHeader from '../../components/Dean/ContentHeader';
import { ChevronDown, ChevronRight, Ellipsis, EllipsisVertical, File, FileSpreadsheet, Folder, FolderPlus, Plus } from 'lucide-react';
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

const AreaParameters = () => {
  const navigate = useNavigate();
  const { period, level, program, area } = useParams();

  const { PROGRAMS_TO_BE_ACCREDITED } = PATH.DEAN;

  const [modalType, setModalType] = useState(null);

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

  const handlePlusClick = () => {
    setModalType(MODAL_TYPE.ADD_PARAMETER);
  };

  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPE.ADD_PARAMETER:
        return (
          <ParameterBaseModal
            onClose={() => setModalType(null)}
            onCancel={() => setModalType(null)}
            onSave={null}
            primaryButton={'Add Parameters'}
            disabled={true}
            secondaryButton={'Cancel'}
            mode='add'
            headerContent={'Add Parameters'}
            bodyContent={
              <div className='relative w-full'>
                <AddField
                  // ref={areaInputRef}
                  fieldName={'Parameters'}
                  placeholder={'Enter a parameter...'}
                  type='textarea'
                  name='areaInput'
                  // formValue={areaInput}
                  multiValue={true}
                  // multiValues={areas}
                  // dropdownItems={areasArray}
                  showDropdownOnFocus={true}
                  // onDropdownMenuClick={handleOptionSelection}
                  // onAddValue={(val) => handleAddAreaValue(val)}
                  // onRemoveValue={(index) => handleRemoveAreaValue(index)}
                  // onChange={(e) => handleAreaChange(e)}
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
              Areas
            </span>
            <ChevronRight className='h-5 w-5'/>
            {formatAreaName(areaName)}
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
        <div className={`flex flex-wrap gap-2 p-2 mb-8 ${parameterData.length === 0 ? 'justify-center' : 'justify-start'}`}>
          {parameterData.length === 0 && (
            <p>
              No parameters to display for {formatAreaName(areaName)}.
            </p>
          )}
          {parameterData.map(({parameter}, index) => (
            <div
              key={index} 
              className='relative flex items-center justify-start border py-5 px-2 w-1/2 rounded-md transition-all cursor-pointer hover:bg-slate-50 active:opacity-50'
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
