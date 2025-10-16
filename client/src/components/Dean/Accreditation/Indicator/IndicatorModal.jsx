import React from 'react';
import MODAL_TYPE from '../../../../constants/modalTypes';
import IndicatorBaseModal from '../../../Modals/accreditation/IndicatorBaseModal';
import AddField from '../../../Form/AddField';

const IndicatorModal = ({ refs, datas, handlers }) => {
  const { indicatorInputRef } = refs;

  const { 
    modalType,
    indicatorInput,
    inputtedIndicators,
    duplicateValues,
    indicatorsBySubparamIdData,
  } = datas;

  const {
    handleCloseModal,
    handleIndicatorChange,
    handleAddIndicatorValue,
    handleRemoveIndicatorValue,
    handleSaveIndicators
  } = handlers;

  switch (modalType) {
    case MODAL_TYPE.ADD_INDICATORS:
      return (
        <IndicatorBaseModal 
          onClose={handleCloseModal}
          onCancel={handleCloseModal}
          onSave={handleSaveIndicators}
          primaryButton={'Add Indicators'}
          disabled={inputtedIndicators?.length === 0}
          secondaryButton={'Cancel'}
          mode='add'
          headerContent={'Add Indicators'}
          bodyContent={
            <div className='relative w-[90%]'>
              <AddField
                ref={indicatorInputRef}
                fieldName={'Indicators'}
                placeholder={indicatorsBySubparamIdData.length > 0 ? 'Enter new indicator or select an existing one...' : 'Enter new indicator...'}
                type='textarea'
                name='indicatorInput'
                formValue={indicatorInput}
                multiValue={true}
                multiValues={inputtedIndicators}
                dropdownScope='indicator'
                dropdownItems={indicatorsBySubparamIdData.map(i => i.indicator)}
                dropDownCondition='canSelectAll'
                showDropdownOnFocus={indicatorsBySubparamIdData.length > 0}
                duplicateValues={duplicateValues}
                onAddValue={handleAddIndicatorValue}
                onRemoveValue={handleRemoveIndicatorValue}
                onChange={(e) => handleIndicatorChange(e)}
              />
            </div>
          }
        />
      );
  }
};

export default IndicatorModal;
