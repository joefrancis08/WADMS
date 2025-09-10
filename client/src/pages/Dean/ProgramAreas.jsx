import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import ContentHeader from '../../components/Dean/ContentHeader';
import AreaBaseModal from '../../components/Modals/accreditation/AreaBaseModal';
import AddField from '../../components/Form/Dean/AddField';
import { ChevronRight, EllipsisVertical, FolderOpen, Plus } from 'lucide-react';
import formatProgramParams from '../../utils/formatProgramParams';
import formatArea from '../../utils/formatArea';
import useAutoFocus from '../../hooks/useAutoFocus';
import useFetchProgramAreas from '../../hooks/fetch-react-query/useFetchProgramAreas';
import { addProgramAreas } from '../../api/accreditation/accreditationAPI';
import { TOAST_MESSAGES } from '../../constants/messages';
import { showErrorToast, showSuccessToast } from '../../utils/toastNotification';
import MODAL_TYPE from '../../constants/modalTypes';
import PATH from '../../constants/path';
import { useProgramToBeAccreditedDetails } from '../../hooks/useAccreditationDetails';

const ProgramAreas = () => {
  const navigate = useNavigate();
  const { periodID, level, programID } = useParams();
  const { level: formattedLevel } = formatProgramParams(level);

  const { startDate, endDate, programName, programObj } = useProgramToBeAccreditedDetails(periodID, programID);

  // Only fetch areas if programObj is ready
  const { areas: areasData, loading, error, refetch } = useFetchProgramAreas(
    startDate,
    endDate,
    formattedLevel,
    programName,
    !!programObj // Pass a boolean to conditionally fetch
  );
  const data = areasData?.data ?? [];

  const [modalType, setModalType] = useState(null);
  const [areas, setAreas] = useState([]);
  const [areaInput, setAreaInput] = useState('');
  const [duplicateValues, setDuplicateValues] = useState([]);

  const areaInputRef = useAutoFocus(modalType, modalType === MODAL_TYPE.ADD_AREA);

  // Remove duplicates automatically if areas state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => areas.includes(val)));
  }, [areas]);

  const findDuplicate = (value) => {
    return data.some(d => d.area.toUpperCase().trim() === value.toUpperCase().trim());
  };

  const handleCloseModal = () => {
    setModalType(null);
    setAreas([]);
  };

  const handleAddAreaValue = (val) => {
    if (findDuplicate(val)) {
      const formattedVal = formatArea(val);
      setDuplicateValues(prev => [...new Set([...prev, formattedVal])]);
      showErrorToast(`${val} already exist.`, 'top-center', 3000);
      return;
    }
    setAreas(prev => [...prev, formatArea(val)]);
    setDuplicateValues(prev => prev.filter(v => v !== formatArea(val)));
  };

  const handleRemoveAreaValue = (index) => {
    const removedVal = areas[index];
    setAreas(prev => prev.filter((_, i) => i !== index));
    setDuplicateValues(prev => prev.filter(v => v !== removedVal));
  };

  const handleSaveAreas = async () => {
    if (!areas.length) return;

    try {
      const res = await addProgramAreas(startDate, endDate, formattedLevel, programName, areas);
      if (res.data.success) {
        showSuccessToast(TOAST_MESSAGES.AREA_ADDITION.SUCCESS);
        handleCloseModal();
        await refetch(); // Refresh areas after save
      }
      
    } catch (err) {
      const isDuplicate = err?.response?.data?.isDuplicate;
      const duplicateValue = err?.response?.data?.duplicateValue;
      const message = err?.response?.data?.message;

      if (isDuplicate && duplicateValue) {
        setDuplicateValues(prev => [...new Set([...prev, duplicateValue])]);
        showErrorToast(message);
      }
    }
  };

  const handleAreaCardClick = (areaID) => {
    navigate(PATH.DEAN.AREA_PARAMETERS({ periodID, level, programID, areaID }));
  };

  const renderModal = () => {
    if (modalType !== MODAL_TYPE.ADD_AREA) return null;

    return (
      <AreaBaseModal
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        onSave={handleSaveAreas}
        primaryButton={areas.length > 1 ? 'Add Areas' : 'Add Area'}
        secondaryButton='Cancel'
        disabled={areas.length === 0 || duplicateValues.length > 0}
        mode='add'
        headerContent={<p className='text-xl font-semibold'>Add Areas</p>}
        bodyContent={
          <div className='relative w-full'>
            <AddField
              ref={areaInputRef}
              fieldName={areas.length > 1 ? 'Areas' : 'Area'}
              placeholder={data.length > 0 ? 'Enter a new area or select an existing one...' : 'Enter a new area'}
              type='textarea'
              name='areaInput'
              formValue={areaInput}
              multiValue
              multiValues={areas}
              showDropdownOnFocus
              duplicateValues={duplicateValues}
              onAddValue={handleAddAreaValue}
              onRemoveValue={handleRemoveAreaValue}
              onChange={(e) => setAreaInput(e.target.value)}
            />
          </div>
        }
      />
    );
  };

  return (
    <DeanLayout>
      <div className='flex-1'>
        <ContentHeader
          headerIcon={FolderOpen}
          headerTitle='Areas'
          searchTitle='Search Areas'
          placeholder='Search Areas...'
          condition
        />

        <div className='flex justify-between px-4 pt-4'>
          <p className='flex flex-row items-center'>
            <span
              title='Back to Programs'
              onClick={() => navigate(PATH.DEAN.PROGRAMS_TO_BE_ACCREDITED)}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              {formattedLevel} - {programName}
            </span>
            <ChevronRight className='h-5 w-5' />
            <span className='font-semibold'>{data.length > 1 ? 'Areas' : 'Area'}</span>
          </p>
        </div>

        <div className='flex justify-end px-5 py-3'>
          <button onClick={() => setModalType(MODAL_TYPE.ADD_AREA)} title='Add Areas' className='cursor-pointer hover:opacity-80 active:opacity-50'>
            <Plus className='h-8 w-8' />
          </button>
        </div>

        <div className='flex flex-wrap gap-4 justify-center mb-8'>
          {!data.length && <p>No data to display.</p>}

          {data.map(({ area_uuid, area }) => (
            <div
              key={area_uuid}
              onClick={() => handleAreaCardClick(area_uuid)}
              className='relative flex flex-col items-start justify-start border py-8 px-4 w-75 rounded-md transition-all cursor-pointer hover:bg-slate-50 active:opacity-50'
            >
              {String(area)
                .toUpperCase()
                .split(/[:-]/)
                .map((s, i) => (
                  <p key={i} className={i === 0 ? 'text-xl font-bold' : 'text-md text-slate-700 font-semibold'}>
                    {s.trim()}
                  </p>
                ))}
              <EllipsisVertical className='absolute top-2 right-1 h-5 w-5' />
            </div>
          ))}
        </div>
      </div>

      {renderModal()}
    </DeanLayout>
  );
};

export default ProgramAreas;
