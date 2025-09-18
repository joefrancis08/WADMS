import React from 'react';
import MODAL_TYPE from '../../constants/modalTypes';
import IndicatorBaseModal from '../Modals/accreditation/IndicatorBaseModal';
import AddField from '../Form/AddField';

const IndicatorModal = ({ refs, datas, handlers }) => {
  const { indicatorInputRef } = refs;

  const { 
    modalType,
    indicatorInput,
    inputtedIndicators,
    duplicateValues 
  } = datas;

  const {
    handleCloseModal,
    handleIndicatorChange,
    handleAddIndicatorValue,
    handleRemoveIndicatorValue
  } = handlers;

  switch (modalType) {
    case MODAL_TYPE.ADD_INDICATORS:
      return (
        <IndicatorBaseModal 
          onClose={handleCloseModal}
          onCancel={handleCloseModal}
          onSave={null}
          primaryButton={'Add Indicators'}
          disabled={false}
          secondaryButton={'Cancel'}
          mode='add'
          headerContent={'Add Indicators'}
          bodyContent={
            <div className='relative w-[90%]'>
              <AddField
                ref={indicatorInputRef}
                fieldName={'Indicators'}
                placeholder={'Enter new indicators...'}
                type='textarea'
                name='subParamInput'
                formValue={indicatorInput}
                multiValue={true}
                multiValues={inputtedIndicators}
                // dropdownItems={data}
                showDropdownOnFocus={true}
                duplicateValues={duplicateValues}
                // onDropdownMenuClick={handleOptionSelection}
                onAddValue={(val) => handleAddIndicatorValue(val)}
                onRemoveValue={(index) => handleRemoveIndicatorValue(index)}
                onChange={(e) => handleIndicatorChange(e)}
                // onFocus={handleFocus}
              />
            </div>
          }
        />
      );
  }
};

export default IndicatorModal;
