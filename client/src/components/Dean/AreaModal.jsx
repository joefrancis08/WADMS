import React from 'react';
import MODAL_TYPE from '../../constants/modalTypes';
import AreaBaseModal from '../Modals/accreditation/AreaBaseModal';
import AddField from '../Form/AddField';

const AreaModal = ({ refs, modalType, datas, inputs, handlers }) => {
  const { areaInputRef } = refs;
  const { areaInput } = inputs;
  const { 
    data,
    areas,
    duplicateValues 
  } = datas;
  const {
    handleCloseModal,
    handleSaveAreas,
    handleAreaInputChange,
    handleAddAreaValue,
    handleRemoveAreaValue
  } = handlers;
  
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
      
  
    default:
      break;
  }
};

export default AreaModal
