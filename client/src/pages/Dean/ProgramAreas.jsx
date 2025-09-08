import React, { useEffect, useState } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { useNavigate, useParams } from 'react-router-dom';
import formatProgramParams from '../../utils/formatProgramParams';
import useFetchProgramAreas from '../../hooks/fetch-react-query/useFetchProgramAreas';
import { ChevronRight, EllipsisVertical, FolderOpen, Plus } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import MODAL_TYPE from '../../constants/modalTypes';
import AreaBaseModal from '../../components/Modals/accreditation/AreaBaseModal';
import AddField from '../../components/Form/Dean/AddField';
import { addProgramAreas } from '../../api/accreditation/accreditationAPI';
import { TOAST_MESSAGES } from '../../constants/messages';
import { showErrorToast, showSuccessToast } from '../../utils/toastNotification';
import PATH from '../../constants/path';
import formatArea from '../../utils/formatArea';
import useAutoFocus from '../../hooks/useAutoFocus';

const ProgramAreas = () => {
  const navigate = useNavigate();

  const { period, level, program } = useParams();
  const { 
    startDate, 
    endDate, 
    level: formattedLevel, 
    program: formattedProgram  
  } = formatProgramParams(period, level, program);

  const { AREA_ADDITION } = TOAST_MESSAGES;
  const { AREA_PARAMETERS, PROGRAMS_TO_BE_ACCREDITED } = PATH.DEAN;

  const { areas: areasData, loading, error, refetch } = useFetchProgramAreas(startDate, endDate, formattedLevel, formattedProgram);
  console.log(areasData);

  const data = areasData.data ?? [];

  const [modalType, setModalType] = useState(null);

  const [areas, setAreas] = useState([]);
  const [areaInput, setAreaInput] = useState('');

  const [duplicateValues, setDuplicateValues] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const areasArray = [];

  // Auto-focus on area input
  const areaInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_AREA
  );

  // If a duplicate was removed from areas, it gets removed from duplicateValues automatically.
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => areas.includes(val)));
  }, [areas]);

  const findDuplicate = (value) => {
    return data.findIndex(d => d.area.toUpperCase().trim() === value.toUpperCase().trim());
  };

  const handleCloseModal = () => {
    setModalType(null);
    setAreas([]);
  }

  const handleAreaChange = (e) => {
    setAreaInput(e.target.value)
  };

  const handleAddAreaValue = (val) => {
    const duplicateIndex = findDuplicate(val);
  
    if (duplicateIndex !== -1) {
      setDuplicateValues(prev => [...new Set([...prev, formatArea(val)])]);
      showErrorToast(`${String(val).toUpperCase()} already exist.`);
      return; 
    }

    setDuplicateValues(prev => prev.filter(v => v !== formatArea(val)));
    setAreas([...areas, formatArea(val)]);
  };

  const handleAddArea = () => {
    setModalType(MODAL_TYPE.ADD_AREA);
  };

  const handleRemoveAreaValue = (index) => {
    const removedVal = areas[index];
    
    setAreas(areas.filter((_, i) => i !== index));

    // If removed value was marked duplicate, clear it from duplicateValues
    setDuplicateValues(prev => prev.filter(v => v !== removedVal));
  };

  const handleSaveAreas = async () => {
    try {
      const res = await addProgramAreas(startDate, endDate, formattedLevel, formattedProgram, areas);
      
      if (res.data.success) {
        showSuccessToast(AREA_ADDITION.SUCCESS);
      } 

      handleCloseModal();

    } catch (error) {
      if (error.response.data.isDuplicate) {
        const message = error.response.data.message;
        const duplicateValue = error.response.data.duplicateValue;
        setDuplicateValues(prev => [...new Set([...prev, duplicateValue])]);
        showErrorToast(message);
      }
    }
  }

  const handleAreaCardClick = (area) => {
    navigate(AREA_PARAMETERS({
      period,
      level,
      program,
      area
    }))
  };

  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPE.ADD_AREA:
        return (
          <AreaBaseModal 
            onClose={handleCloseModal}
            onCancel={handleCloseModal}
            onSave={handleSaveAreas}
            primaryButton={areas.length > 1 ? 'Add Areas' : 'Add Area'}
            secondaryButton={'Cancel'}
            disabled={areas.length === 0 || duplicateValues.length > 0}
            mode='add'
            headerContent={
              <div>
                <p className='text-xl font-semibold'>
                  Add Areas
                </p>
              </div>
            }
            bodyContent={
              <div className='relative w-full'>
                <AddField
                  ref={areaInputRef}
                  fieldName={areas.length > 1 ? 'Areas' : 'Area'}
                  placeholder={areasArray.length > 0 
                    ? 'Enter a new area or select an existing one...' 
                    : 'Enter a new area'
                  }
                  type='textarea'
                  name='areaInput'
                  formValue={areaInput}
                  multiValue={true}
                  multiValues={areas}
                  // dropdownItems={data}
                  showDropdownOnFocus={true}
                  duplicateValues={duplicateValues}
                  // onDropdownMenuClick={handleOptionSelection}
                  onAddValue={(val) => handleAddAreaValue(val)}
                  onRemoveValue={(index) => handleRemoveAreaValue(index)}
                  onChange={(e) => handleAreaChange(e)}
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
          headerIcon={FolderOpen}
          headerTitle='Areas'
          searchTitle='Search Areas'
          placeholder='Search Areas...'
          condition={true}
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
            <span className='font-semibold'>
              {data.length > 1 ? 'Areas' : 'Area'}
            </span>
          </p>
        </div>
        <div className='flex justify-end px-5 py-3'>
          <button
            onClick={handleAddArea}
            title='Add Areas'
            className='cursor-pointer hover:opacity-80 active:opacity-50'
          >
            <Plus className='h-8 w-8' />
          </button>
        </div>
        <div className='flex flex-wrap gap-4 justify-center mb-8'>
          {data.length === 0 && (
            <p>
              No data to display.
            </p>
          )}
          {data.map(({area_uuid, area}, index) => (
            <div
              key={index}
              onClick={() => handleAreaCardClick(area_uuid)}  
              className='relative flex flex-col items-start justify-start border py-8 px-4 w-75 rounded-md transition-all cursor-pointer hover:bg-slate-50 active:opacity-50'
            >
              {String(area).toUpperCase().split(/[:-]/).map((s, i) => (
                <p 
                  key={i}
                  className={`text-start 
                    ${i === 0 
                      ? 'text-xl font-bold' 
                      : 'text-md text-slate-700 font-semibold'}`
                  }
                >
                  {s.trim()}
                </p>
              ))}
              <EllipsisVertical className='absolute top-2 right-1 h-5 w-5'/>
            </div>
          ))}
        </div>
      </div>
      {renderModal()}
    </DeanLayout>
  );
};

export default ProgramAreas;
