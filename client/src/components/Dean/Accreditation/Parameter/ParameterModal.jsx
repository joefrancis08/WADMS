import React from 'react';
import MODAL_TYPE from '../../../../constants/modalTypes';
import ParameterBaseModal from '../../../Modals/accreditation/ParameterBaseModal';
import AddField from '../../../Form/AddField';

const ParameterModal = ({ refs, modalType, datas, inputs, handlers }) => {
  const { parameterInputRef } = refs;
  const { parameterInput } = inputs;
  const { 
    parametersArr,
    duplicateValues
  } = datas;
  const {
    handleCloseModal,
    handleSaveParameters,
    handleAddParameterValue,
    handleRemoveParameterValue,
    handleParameterChange
  } = handlers;
 
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
          headerContent={<p className='text-xl font-semibold'>Add Parameters</p>}
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
                duplicateValues={duplicateValues}
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

export default ParameterModal;
