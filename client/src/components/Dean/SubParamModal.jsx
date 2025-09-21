import React from 'react';
import MODAL_TYPE from '../../constants/modalTypes';
import SubParameterBaseModal from '../Modals/accreditation/SubParameterBaseModal';
import AddField from '../Form/AddField';
import ConfirmationModal from '../Modals/ConfirmationModal';
import { File, FileText, Trash2 } from 'lucide-react';

const SubParamModal = ({ refs, modalType, datas, handlers }) => {
  const { subParamInputRef } = refs;
  const { 
    subParamsArr,
    subParameterInput,
    duplicateValues,
    modalData
  } = datas;
  
  const { 
    handleCloseModal,
    handleSaveSubParams,
    handleAddSubParamValue,
    handleRemoveSubParamValue,
    handleSubParamChange,
    handleConfirmRemove
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

    case MODAL_TYPE.DELETE_DOC:
      return (
        <ConfirmationModal 
          onClose={handleCloseModal}
          onCancelClick={handleCloseModal}
          onConfirmClick={() => handleConfirmRemove(modalData?.docId)}
          isDelete={true}
          primaryButton={'Delete'}
          secondaryButton={'Cancel'}
          bodyContent={
            <div className='flex flex-col items-center justify-center gap-y-4 px-4'>
              <div className='flex flex-col items-center justify-center gap-y-1'>
                <div className='relative'>
                  <FileText className='text-red-400 h-16 w-16' />
                  <Trash2 className='absolute bottom-0 right-0 bg-white rounded-full h-7 w-7 text-red-400 flex shrink-0 p-1' />
                </div>
                
                <p className='text-center text-red-500 text-xl'>
                  Delete
                </p>
                <p className='text-center font-medium'>
                  {modalData?.document}
                </p>
              </div>
              <p className='mb-8'>
                Are you sure you want to delete this document?
              </p>
            </div>
          }
        />
      );
  
    default:
      break;
  }
};

export default SubParamModal;
