import React from 'react';
import MODAL_TYPE from '../../../../constants/modalTypes';
import AreaBaseModal from '../../../Modals/accreditation/AreaBaseModal';
import AddField from '../../../Form/AddField';
import ConfirmationModal from '../../../Modals/ConfirmationModal';
import { Ellipsis, LoaderCircle, Plus, TriangleAlert, UserRoundX, UserX, X } from 'lucide-react';
import { deleteFolder, notAssignedDM, userIcon } from '../../../../assets/icons';
import Popover from '../../../Popover';
import { MENU_OPTIONS } from '../../../../constants/user';
import PATH from '../../../../constants/path';
import { replace } from 'react-router-dom';

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const AreaModal = ({ navigation, refs, modalType, datas, inputs, handlers }) => {
  const { navigate } = navigation;
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
    activeTaskForceId
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
    handleUnassignedAllClick,
  } = handlers;

  function formatAreaName(text) {
    // Words that should always be lowercase
    const lowerWords = ['and', 'or'];
    // Roman numerals that should always stay uppercase
    const toUpperWords = ['i:', 'ii:', 'iii:', 'iv:', 'v:', 'vi:'];

    return text
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (lowerWords.includes(word)) {
          return word; // Keep as lowercase
        }
        console.log(word)
        if (toUpperWords.includes(word)) {
          return word.toUpperCase(); // Force Roman numerals uppercase
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

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
                placeholder={areasByLevelData.length > 0 ? 'Enter a new area or select an existing one...' : 'Enter a new area'}
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
          onClose={handleCloseModal}
          onCancel={handleCloseModal}
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
            <p className='text-xl font-semibold'>
              Assign Task Force to {modalData.area}
            </p>
          }
          bodyContent={
            <div className='relative w-full border min-h-50 max-h-75 overflow-auto border-slate-500 rounded-lg px-4 pb-2'>
              <div className='sticky top-0 bg-white flex items-center justify-between py-2'>
                <h2>Select or Add Task Force</h2>
                <button 
                  title='Add Task Force'
                  className='p-1 hover:bg-slate-200 rounded-full cursor-pointer active:scale-95'>
                  <Plus className='active:scale-95'/>
                </button>
              </div>
              <hr className='text-slate-200'></hr>
              <div className='flex flex-col p-4'>
                {taskForce.length > 0 && (
                  <div className='flex gap-2 mb-2'>
                    <input 
                      type="checkbox"  
                      id="select-all" 
                      checked={selectedTaskForce.length === taskForce.length}
                      onChange={handleSelectAll}
                    />
                    <label htmlFor="select-all">
                      {selectedTaskForce.length === taskForce.length 
                        ? 'Deselect all' 
                        : 'Select all'
                      }
                    </label>
                  </div>
                )}
                {taskForceLoading 
                  ? (
                      <div className='flex gap-y-4 flex-col items-center justify-center h-40 w-full'>
                        <LoaderCircle className='h-12 w-12 animate-spin text-slate-800'/>
                        <p className='text-slate-900'>Loading task force data...</p>
                      </div>
                    ) 
                  : (
                      taskForce.length > 0 ? taskForce.map((data, index) => (
                      <div 
                        key={index}
                        onClick={() => handleCheckboxChange(data.id)} 
                        className='flex bg-slate-100 py-3 px-2 -ml-2 mb-1 hover:bg-slate-200 cursor-pointer justify-between items-center rounded-lg active:scale-99'
                      >
                        <div className='flex gap-3 items-center'>
                          <input 
                            type="checkbox" 
                            id={`user-${data.id}`}
                            checked={selectedTaskForce.includes(data.id)} 
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => handleCheckboxChange(data.id)}
                            className="cursor-pointer"
                          />
                          <img 
                            src={`${PROFILE_PIC_PATH}/${data.profilePicPath || '/default-profile-picture.png'}`} 
                            alt="Profile Picture" 
                            loading='lazy' 
                            className='h-12 w-12 p-0.5 rounded-full border-2 border-green-600'
                          />
                          <div className='flex flex-col'>
                            <p className='text-semibold'>
                              {data.fullName}
                            </p>
                            <p className='text-xs text-slate-600 italic mr-4'>
                              {data.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    )) 
                  : (
                      <div className='flex gap-y-4 flex-col items-center justify-center h-40 w-full'>
                        <UserRoundX className='h-16 w-16 text-slate-600'/>
                        <p className='text-sm text-slate-800'>
                          No task force yet.
                        </p>
                      </div>
                    )
                  )}
              </div>
            </div>
          }
        />
      );

    case MODAL_TYPE.VIEW_ASSIGNED_TASK_FORCE:
      return (
        <div className="h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs overflow-hidden">
          <div className="w-full md:max-w-xl min-h-80 max-md:mx-4 bg-white rounded shadow-2xl px-6 pt-4 animate-fadeIn ">
            <div className='flex text-slate-800 justify-between items-center max-md:items-center'>
              <h1 className='font-semibold text-lg'>Assigned Task Force for {modalData.area}</h1>
              <button 
                onClick={handleCloseModal}
                className='p-2 hover:bg-slate-200 rounded-full cursor-pointer -mr-2'>
                <X className='h-5 w-5' />
              </button>
            </div>
            <p className='text-sm -mt-2'>
              {modalData.taskForces.length} {' '} 
              {modalData.taskForces.length > 1 ? 'people' : 'person'} {' '}
              assigned
            </p>
            <hr className='text-slate-400 mt-3 mx-auto'></hr>
            <div className='flex flex-col gap-2 mb-4 min-h-50 max-h-80 overflow-auto py-4'>
              {modalData.taskForces.map((tf) => (
                <div className='relative flex justify-between bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200'>
                  <div className='flex items-center gap-3'>
                    <img 
                      src={`${PROFILE_PIC_PATH}/${tf.profilePic}`} 
                      alt="Profile Picture" 
                      loading='lazy' 
                      className='h-10 w-10 border-green-800 border-2 rounded-full'
                    />
                    <div>
                      <p>{tf.fullName}</p>
                      <p className='text-xs text-slate-500 italic'>
                        {tf.role}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleEllipsisClick({ taskForceId: tf.id })}
                    className='cursor-pointer hover:bg-slate-300 px-2 rounded-full active:scale-95'>
                    <Ellipsis className='h-5 w-5'/>
                  </button>
                  {activeTaskForceId === tf.id && (
                    <div ref={assignedTaskForceRef} className='absolute top-12 right-3 border border-slate-700 min-w-50 min-h-25 bg-slate-800 rounded-lg z-20 p-2'>
                      <div className='flex flex-col gap-2 items-start text-slate-100 text-sm'>
                        {MENU_OPTIONS.DEAN.ASSIGNED_TASK_FORCE.map((item, index) => {
                          const Icon = item.icon;

                          return (
                            <>
                              {item.label === 'View Profile' && (
                                <hr className='text-slate-700 w-[90%] mx-auto'></hr>
                              )}
                              <button
                                onClick={() => {
                                  if (item.label === 'View Profile') {
                                    navigate(PATH.DEAN.TASK_FORCE_DETAIL(tf.uuid), {
                                      state: { from: PATH.DEAN.PROGRAM_AREAS({ accredInfoUUID, level, programUUID }) } 
                                    })
                                  }
                                }}
                                key={index} 
                                className='flex items-center justify-start gap-x-2 rounded-lg p-2 hover:bg-slate-700 w-full cursor-pointer active:scale-98'>
                                <Icon />
                                <span>{item.label}</span>
                              </button>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button 
                onClick={handleAddTaskForceClick}
                className='flex items-center gap-2 py-2 justify-center bg-green-600 text-slate-100 mt-4 rounded-lg cursor-pointer hover:bg-green-700 active:scale-95 transition'>
                <Plus />
                <span>Add</span>
              </button>
              {modalData.taskForces.length > 1 && (
                <button
                  onClick={handleUnassignedAllClick} 
                  className='flex items-center justify-center gap-2 py-2 bg-red-400 cursor-pointer hover:bg-red-500 text-slate-100 rounded-lg active:scale-95 transition'>
                  <X className='w-5'/>
                  <span>Unassigned all</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );

    case MODAL_TYPE.REMOVE_AREA:
      return (
        <ConfirmationModal 
          onClose={handleCloseModal}
          onCancelClick={handleCloseModal}
          onConfirmClick={() => handleConfirmRemoval({
            title: modalData.title,
            year: modalData.year,
            accredBody: modalData.accredBody,
            level: modalData.level,
            program: modalData.program,
            area: formatAreaName(modalData.area)
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
