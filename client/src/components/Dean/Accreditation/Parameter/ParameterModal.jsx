import React from 'react';
import MODAL_TYPE from '../../../../constants/modalTypes';
import ParameterBaseModal from '../../../Modals/accreditation/ParameterBaseModal';
import AddField from '../../../Form/AddField';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import { deleteFolder } from '../../../../assets/icons';
import ATFModalBody from '../Area/ATFModalBody';

const ParameterModal = ({ refs, modalType, datas, inputs, handlers }) => {
  const { parameterInputRef } = refs;
  const { parameterInput } = inputs;
  const { 
    parametersArr,
    duplicateValues,
    modalData,
    taskForce,
    taskForceLoading,
    taskForceError,
    taskForceRefetch
  } = datas;
  const {
    handleCloseModal,
    handleSaveParameters,
    handleAddParameterValue,
    handleRemoveParameterValue,
    handleParameterChange,
    handleConfirmDelete
  } = handlers;
 
  switch (modalType) {
    case MODAL_TYPE.ADD_PARAMETER:
      return (
        <ParameterBaseModal
          onClose={() => handleCloseModal({ addParam: true })}
          onCancel={() => handleCloseModal({ addParam: true })}
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

    case MODAL_TYPE.ASSIGN_TASK_FORCE:
      return (
        <ParameterBaseModal 
          onClose={() => handleCloseModal({ assignTaskForce: true })}
          onCancel={() => handleCloseModal({ assignTaskForce: true })}
          onSave={null}
          primaryButton='Assign'
          disabled={true}
          secondaryButton='Cancel'
          mode={'add'}
          headerContent={
            <p className='text-xl font-semibold'>
              Assign Task Force to {modalData?.parameter}
            </p>
          }
          bodyContent={
            <ATFModalBody 
              data={{
                taskForce, 
                taskForceLoading, 
                // selectedTaskForce: null
              }}
              handlers={{
                // handleSelectAll, 
                // handleCheckboxChange
              }}
            />
          }
        />
      );

    case MODAL_TYPE.DELETE_PARAM:
      return (
        <ConfirmationModal 
          onClose={() => handleCloseModal({ deleteParam: true })}
          onCancelClick={() => handleCloseModal({ deleteParam: true })}
          onConfirmClick={() => handleConfirmDelete({
            id: modalData.apmId, 
            parameter: modalData.parameter
          })}
          primaryButton='Delete'
          secondaryButton='Cancel'
          isDelete={true}
          bodyContent={
            <div className='flex flex-col items-center justify-center pb-4 px-2'>
              <div className='flex flex-col items-center justify-center pb-4'>
                <img src={deleteFolder} alt="Folder Delete" className='h-24 w-24 opacity-80' />
                <p className='flex flex-col px-8 text-md md:text-lg text-center'>
                  <span className='text-red-500 text-2xl font-semibold mt-2'>
                    Delete
                  </span>
                </p>
              </div>
              
              <div className='pb-2 space-y-2'>
                <p className='px-8 text-center'>
                  This action will permanently delete the sub-parameters and documents under this parameter. This action cannot be undone.
                </p>
                <p className='px-8 text-center'>
                  Do you really want to delete {' '}
                  <span className='font-medium'>
                    {modalData.parameter}
                  </span>
                  ?
                </p>
              </div>
            </div>
          }
        />
      );

    default:
      break;
  }
};

export default ParameterModal;
