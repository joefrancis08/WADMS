import React from 'react';
import MODAL_TYPE from '../../../../constants/modalTypes';
import SubParameterBaseModal from '../../../Modals/accreditation/SubParameterBaseModal';
import AddField from '../../../Form/AddField';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import { File, FileText, Trash2 } from 'lucide-react';
import { deleteFolder } from '../../../../assets/icons';
import ATFModalBody from '../Area/ATFModalBody';
import VATFModal from '../Area/VATFModal';

const SubParamModal = ({ refs, modalType, datas, handlers }) => {
  const { subParamInputRef } = refs;
  const { 
    subParamsArr,
    subParamsByParamIdData,
    subParameterInput,
    duplicateValues,
    modalData,
    taskForce,
    taskForceLoading,
    taskForceError,
    taskForceRefetch,
    selectedTaskForce,
    activeTaskForceId,
    showConfirmUnassign,
    assignedTaskForceRef
  } = datas;
  
  const { 
    handleCloseModal,
    handleSaveSubParams,
    handleAddSubParamValue,
    handleRemoveSubParamValue,
    handleSubParamChange,
    handleConfirmRemove,
    handleDeleteSubParam,
    handleCheckboxChange,
    handleSelectAll,
    handleAssignTaskForce,
    handleAddTaskForceClick,
    handleATFEllipsisClick,
    handleUnassignedAllClick,
    handleAssignedOptionsClick,
    handleConfirmUnassign
  } = handlers;

  console.log(modalData);

  switch (modalType) {
    case MODAL_TYPE.ADD_SUBPARAMETERS:
      return (
        <SubParameterBaseModal 
          onClose={() => handleCloseModal({ addSubParameter: true })}
          onCancel={() => handleCloseModal({ addSubParameter: true })}
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
                placeholder={subParamsByParamIdData.length > 0 ? 'Enter new sub-parameter or select an existing one...' : 'Enter new sub-parameters...'}
                type='textarea'
                name='subParamInput'
                formValue={subParameterInput}
                isDropdown={subParamsByParamIdData.length > 0}
                dropDownCondition='canSelectAll'
                multiValue={true}
                multiValues={subParamsArr}
                dropdownScope='sub-parameter'
                dropdownItems={subParamsByParamIdData.map(sp => sp.sub_parameter_name)}
                showDropdownOnFocus={subParamsByParamIdData.length > 0}
                duplicateValues={duplicateValues}
                onAddValue={handleAddSubParamValue}
                onRemoveValue={handleRemoveSubParamValue}
                onChange={(e) => handleSubParamChange(e)}
              />
            </div>
          }
        />
      );

    case MODAL_TYPE.ASSIGN_TASK_FORCE:
      return (
        <SubParameterBaseModal
          onClose={() => handleCloseModal({ assignTaskForce: true })}
          onCancel={() => handleCloseModal({ assignTaskForce: true })}
          onSave={() => handleAssignTaskForce({
            accredInfoId: modalData.accredInfoId, 
            levelId: modalData.levelId, 
            programId: modalData.programId, 
            areaId: modalData.areaId, 
            parameterId: modalData.paramId, 
            subParameterId: modalData.subParamId, 
            subParameter: modalData.subParameter
          })}
          primaryButton={'Assign'}
          disabled={selectedTaskForce.length === 0}
          secondaryButton={'Cancel'}
          mode={'add'}
          headerContent={
            <p className='text-lg text-slate-900 font-semibold w-full truncate'>
              Assign Task Force to {modalData?.subParameter}
            </p>
          }
          bodyContent={
            <ATFModalBody
              data={{
                taskForce,
                taskForceLoading,
                taskForceError,
                taskForceRefetch,
                selectedTaskForce
              }}
              handlers={{
                handleCheckboxChange,
                handleSelectAll
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
          scope='subParameter'
        />
      );

    case MODAL_TYPE.DELETE_SUBPARAM:
       return (
        <ConfirmationModal 
          onClose={() => handleCloseModal({ deleteSubParam: true })}
          onCancelClick={() => handleCloseModal({ deleteSubParam: true })}
          onConfirmClick={() => handleDeleteSubParam({
            pspmId: modalData.pspmId, 
            subParamId: modalData.subParamId, 
            subParameter: modalData.subParameter
          })}
          isDelete={true}
          primaryButton={'Delete'}
          secondaryButton={'Cancel'}
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
                  This action will permanently delete the records under this sub-parameter. This action cannot be undone.
                </p>
                <p className='px-8 text-center'>
                  Do you really want to delete {' '}
                  <span className='font-medium'>
                    {modalData.subParameter}?
                  </span>
                </p>
              </div>
            </div>
          }
        />
      );

    case MODAL_TYPE.DELETE_DOC:
      return (
        <ConfirmationModal 
          onClose={() => handleCloseModal({ deleteDoc: true })}
          onCancelClick={() => handleCloseModal({ deleteDoc: true })}
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
