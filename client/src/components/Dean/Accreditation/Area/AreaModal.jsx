import MODAL_TYPE from '../../../../constants/modalTypes';
import AreaBaseModal from '../../../Modals/accreditation/AreaBaseModal';
import AddField from '../../../Form/AddField';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import { deleteFolder } from '../../../../assets/icons';
import ATFModalBody from './ATFModalBody';
import VATFModal from './VATFModal';

const AreaModal = ({ refs, modalType, datas, inputs, handlers }) => {
  const { areaInputRef, assignedTaskForceRef } = refs;
  const { areaInput } = inputs;
  const {
    accredInfoUUID,
    level,
    programUUID, 
    data,
    areas,
    areasByLevelData,
    modalData,
    duplicateValues,
    taskForce,
    taskForceLoading,
    taskForceError,
    selectedTaskForce,
    activeTaskForceId,
    showConfirmUnassign
  } = datas;
  const {
    handleCloseModal,
    handleSaveAreas,
    handleAreaInputChange,
    handleAddAreaValue,
    handleRemoveAreaValue,
    handleRemoveAllAreas,
    handleConfirmRemoval,
    handleCheckboxChange,
    handleSelectAll,
    handleAssignTaskForce,
    handleEllipsisClick,
    handleAddTaskForceClick,
    handleUnassignedClick,
    handleUnassignedAllClick,
    handleAssignedOptionsClick,
    handleConfirmUnassign
  } = handlers;

  switch (modalType) {
    case MODAL_TYPE.ADD_AREA:
      return (
        <AreaBaseModal
          onClose={() => handleCloseModal({ addArea: true })}
          onCancel={() => handleCloseModal({ addArea: true })}
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
                placeholder={areasByLevelData.length > 0 ? 'Enter new area or select an existing one...' : 'Enter new area...'}
                type='textarea'
                name='areaInput'
                formValue={areaInput}
                isDropdown={areasByLevelData.length > 0}
                dropdownItems={areasByLevelData.map(a => a.area_name)}
                multiValue={true}
                multiValues={areas}
                dropDownCondition='canSelectAll'
                showDropdownOnFocus={areasByLevelData.length > 0}
                duplicateValues={duplicateValues}
                onAddValue={handleAddAreaValue}
                onRemoveValue={handleRemoveAreaValue}
                onChange={(e) => handleAreaInputChange(e)}
              />
            </div>
          }
        />
      );

    case MODAL_TYPE.ASSIGN_TASK_FORCE:
      return (
        <AreaBaseModal 
          mode='add'
          onClose={() => handleCloseModal({ assignTaskForce: true })}
          onCancel={() => handleCloseModal({ assignTaskForce: true })}
          onSave={() => handleAssignTaskForce({
            accredInfoId: modalData.accredId,
            levelId: modalData.levelId,
            programId: modalData.programId,
            areaId: modalData.areaId,
            area: modalData.area
          })}
          primaryButton={'Assign'}
          disabled={selectedTaskForce.length === 0}
          secondaryButton={'Cancel'}
          headerContent={
            <p className='text-lg text-slate-800 font-semibold w-full truncate'>
              Assign Task Force to {modalData?.area}
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
            handleCloseModal, handleEllipsisClick, handleAssignedOptionsClick, handleAddTaskForceClick,
            handleUnassignedAllClick, handleConfirmUnassign
          }}
          scope='area'
        />
      );

    case MODAL_TYPE.REMOVE_AREA:
      return (
        <ConfirmationModal 
          onClose={() => handleCloseModal({ removeArea: true })}
          onCancelClick={() => handleCloseModal({ removeArea: true })}
          onConfirmClick={() => handleConfirmRemoval({
            title: modalData.title,
            year: modalData.year,
            accredBody: modalData.accredBody,
            level: modalData.level,
            program: modalData.program,
            area: modalData.area
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
                  This action will permanently delete the parameters and documents under this area. This action cannot be undone.
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

export default AreaModal;
