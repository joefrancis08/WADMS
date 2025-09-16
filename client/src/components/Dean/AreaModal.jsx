import React from 'react';
import MODAL_TYPE from '../../constants/modalTypes';
import AreaBaseModal from '../Modals/accreditation/AreaBaseModal';
import AddField from '../Form/AddField';
import ConfirmationModal from '../Modals/ConfirmationModal';
import { TriangleAlert } from 'lucide-react';

const AreaModal = ({ refs, modalType, datas, inputs, handlers }) => {
  const { areaInputRef } = refs;
  const { areaInput } = inputs;
  const { 
    data,
    areas,
    modalData,
    duplicateValues 
  } = datas;
  const {
    handleCloseModal,
    handleSaveAreas,
    handleAreaInputChange,
    handleAddAreaValue,
    handleRemoveAreaValue,
    handleConfirmRemoval
  } = handlers;

  function formatAreaName(text) {
    // Words that should always be lowercase
    const lowerWords = ['and', 'or'];
    // Roman numerals that should always stay uppercase
    const toUpperWords = ['i:', 'ii:', 'iii:', 'iv:', 'v:', 'vi:'];

    return text
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (lowerWords.includes(word)) {
          return word; // Keep as lowercase
        }
        console.log(word)
        if (toUpperWords.includes(word)) {
          return word.toUpperCase(); // Force Roman numerals uppercase
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }


  switch (modalType) {
    case MODAL_TYPE.ADD_AREA:
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
                onChange={(e) => handleAreaInputChange(e)}
              />
            </div>
          }
        />
      );
    case MODAL_TYPE.REMOVE_AREA:
      return (
        <ConfirmationModal 
          onClose={handleCloseModal}
          onCancelClick={handleCloseModal}
          onConfirmClick={() => handleConfirmRemoval({
            title: modalData.title,
            year: modalData.year,
            accredBody: modalData.accredBody,
            level: modalData.level,
            program: modalData.program,
            area: formatAreaName(modalData.area)
          })}
          isDelete={true}
          primaryButton={'Remove'}
          secondaryButton={'Cancel'}
          bodyContent={
            <div className='flex flex-col items-center justify-center pb-4 px-2'>
              <div className='flex flex-col items-center justify-center pb-4'>
                <TriangleAlert className='text-red-400 h-24 w-24'/>
                <p className='flex flex-col px-8 text-md md:text-lg text-center'>
                  <span className='text-red-500 font-semibold'>
                    Remove
                  </span>
                  <span className='font-semibold'>
                    {formatAreaName(modalData.area)}
                  </span>
                </p>
              </div>
              
              <div className='pb-2 space-y-2'>
                <p className='px-8 text-center'>
                  This will permanently delete the parameters and documents under this area. This action cannot be undone.
                </p>
                <p className='px-8 text-center'>
                  Do you want to proceed?
                </p>
              </div>
            </div>
          }
        />
      );

    default:
      return null;
  }
};

export default AreaModal
