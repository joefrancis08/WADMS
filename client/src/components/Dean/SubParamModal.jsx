import React from 'react';
import MODAL_TYPE from '../../constants/modalTypes';
import SubParameterBaseModal from '../Modals/accreditation/SubParameterBaseModal';
import AddField from '../Form/AddField';

const SubParamModal = ({ refs, modalType, datas, handlers }) => {
  const { subParamInputRef } = refs;
  const { 
    subParamsArr,
    subParameterInput,
    duplicateValues
  } = datas;
  
  const { 
    handleCloseModal,
    handleSaveSubParams,
    handleAddSubParamValue,
    handleRemoveSubParamValue,
    handleSubParamChange
  } = handlers;

  switch (modalType) {
      case MODAL_TYPE.ADD_SUBPARAMETERS:
        return (
          <SubParameterBaseModal 
            onClose={handleCloseModal}
            onCancel={handleCloseModal}
            onSave={handleSaveSubParams}
            primaryButton={
              subParamsArr.length > 1 
                ? 'Add Sub-Parameters'
                : 'Add Sub-Parameter'
            }
            disabled={subParamsArr.length === 0}
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
                  fieldName={
                    subParamsArr.length > 1
                      ? 'Sub-Parameters'
                      : 'Sub-Parameter'
                  }
                  placeholder={'Enter new sub-parameters...'}
                  type='textarea'
                  name='subParamInput'
                  formValue={subParameterInput}
                  multiValue={true}
                  multiValues={subParamsArr}
                  // dropdownItems={data}
                  showDropdownOnFocus={true}
                  duplicateValues={duplicateValues}
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

export default SubParamModal;
