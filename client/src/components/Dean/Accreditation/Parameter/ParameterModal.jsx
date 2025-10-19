import React from 'react';
import MODAL_TYPE from '../../../../constants/modalTypes';
import ParameterBaseModal from '../../../Modals/accreditation/ParameterBaseModal';
import AddField from '../../../Form/AddField';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import { deleteFolder } from '../../../../assets/icons';
import ATFModalBody from '../Area/ATFModalBody';
import VATFModal from '../Area/VATFModal';

const ParameterModal = ({ refs, modalType, datas, inputs, handlers }) => {
  const { parameterInputRef, assignedTaskForceRef } = refs;
  const { parameterInput } = inputs;
  const { 
    parametersArr,
    paramsByAreaIdData,
    duplicateValues,
    modalData,
    taskForce,
    taskForceLoading,
    taskForceError,
    taskForceRefetch,
    selectedTaskForce,
    activeTaskForceId,
    showConfirmUnassign
  } = datas;
  console.log(modalData);
  const {
    handleCloseModal,
    handleSaveParameters,
    handleAddParameterValue,
    handleRemoveParameterValue,
    handleParameterChange,
    handleConfirmDelete,
    handleCheckboxChange,
    handleSelectAll,
    handleAssignTaskForce,
    handleATFEllipsisClick,
    handleAddTaskForceClick,
    handleUnassignedAllClick,
    handleAssignedOptionsClick,
    handleConfirmUnassign
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
          headerContent={<p className='text-lg text-slate-800 font-semibold'>Add Parameters</p>}
          bodyContent={
            <div className='relative w-full'>
              <AddField
                ref={parameterInputRef}
                fieldName={parametersArr.length > 1 ? 'Parameters' : 'Parameter'}
                placeholder={paramsByAreaIdData.length > 0 ? 'Enter new parameter or select an existing one...' : 'Enter new parameter...'}
                type='textarea'
                name='parameterInput'
                formValue={parameterInput}
                isDropdown={paramsByAreaIdData.length > 0}
                dropDownCondition='canSelectAll'
                multiValue={true}
                multiValues={parametersArr}
                dropdownScope='parameter'
                dropdownItems={paramsByAreaIdData.map(p => p.parameter_name)}
                showDropdownOnFocus={paramsByAreaIdData.length > 0}
                duplicateValues={duplicateValues}
                onAddValue={handleAddParameterValue}
                onRemoveValue={handleRemoveParameterValue}
                onChange={(e) => handleParameterChange(e)}
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
          onSave={() => handleAssignTaskForce({
            accredInfoId: modalData.accredInfoId, 
            levelId: modalData.levelId, 
            programId: modalData.programId, 
            areaId: modalData.areaId, 
            parameterId: modalData.parameterId, 
            parameter: modalData.parameter
          })}
          primaryButton='Assign'
          disabled={selectedTaskForce.length === 0}
          secondaryButton='Cancel'
          mode={'add'}
          headerContent={
            <p 
              title={`Assign Task Force to ${modalData?.parameter}`}
              className='text-xl text-slate-800 font-semibold w-full truncate'>
              Assign Task Force to {modalData?.parameter}
            </p>
          }
          bodyContent={
            <ATFModalBody 
              data={{
                taskForce, 
                taskForceLoading, 
                selectedTaskForce
              }}
              handlers={{
                handleSelectAll, 
                handleCheckboxChange
              }}
            />
          }
        />
      );

    case MODAL_TYPE.VIEW_ASSIGNED_TASK_FORCE:
      return (
        <VATFModal 
          data={{
            modalData, activeTaskForceId, assignedTaskForceRef,
            showConfirmUnassign 
          }}
          handlers={{
            handleCloseModal, handleEllipsisClick: handleATFEllipsisClick, handleAssignedOptionsClick, handleAddTaskForceClick,
            handleUnassignedAllClick, handleConfirmUnassign 
          }}
          scope='parameter'
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
