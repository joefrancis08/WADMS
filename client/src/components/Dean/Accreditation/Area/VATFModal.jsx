import React from 'react';
import { MENU_OPTIONS } from '../../../../constants/user';
import { Ellipsis, Plus, X } from 'lucide-react';
import ConfirmationModal from '../../../Modals/ConfirmationModal';

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const VATFModal = ({ data = {}, handlers = {}, scope = 'area' }) => {
  const { 
    modalData, activeTaskForceId, assignedTaskForceRef,
    showConfirmUnassign 
  } = data;

  const { 
    handleCloseModal, handleEllipsisClick, handleAssignedOptionsClick, handleAddTaskForceClick,
    handleUnassignedAllClick, handleConfirmUnassign 
  } = handlers;

  return (
    <>
      <div className="h-full fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs overflow-hidden">
        {console.log(modalData)}
        <div className="w-full md:max-w-xl min-h-80 max-md:mx-4 bg-white rounded shadow-2xl px-6 pt-4 animate-fadeIn ">
          <div className='flex text-slate-800 justify-between items-center max-md:items-center'>
            <h1 
              title={`Assigned Task Force for ${modalData?.[scope]}`} 
              className='font-semibold text-lg w-full truncate'
            >
              Assigned Task Force for {modalData?.[scope]}
            </h1>
            <button 
              onClick={() => handleCloseModal({ viewAssignedTaskForce: true })}
              className='p-2 hover:bg-slate-200 rounded-full cursor-pointer -mr-2'>
              <X className='h-5 w-5' />
            </button>
          </div>
          {modalData?.taskForces.length > 0 && (
            <p className='text-sm -mt-2'>
              {modalData?.taskForces.length} {' '} 
              {modalData?.taskForces.length > 1 ? 'people' : 'person'} {' '}
              assigned
            </p>
          )}
          <hr className='text-slate-400 mt-3 mx-auto'></hr>
          <div className='flex flex-col gap-2 mb-4 min-h-50 max-h-80 overflow-auto py-4'>
            {modalData?.taskForces?.length > 0 ? modalData?.taskForces.map((tf, index) => (
              <div key={index} className='relative flex justify-between bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200'>
                <div className='flex items-center gap-3'>
                  <img 
                    src={`${PROFILE_PIC_PATH}/${tf.profilePic}`} 
                    alt="Profile Picture" 
                    loading='lazy' 
                    className='h-10 w-10 border-green-800 border-2 rounded-full'
                  />
                  <div>
                    <p>{tf?.fullName}</p>
                    <p className='text-xs text-slate-500 italic'>
                      {tf?.role}
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
                          <React.Fragment key={index}>
                            {item.label === 'View Profile' && (
                              <hr className='text-slate-700 w-[90%] mx-auto'></hr>
                            )}
                            <button
                              onClick={() => handleAssignedOptionsClick(item, {
                                accredInfoId: modalData?.accredInfoId,
                                levelId: modalData?.levelId,
                                programId: modalData?.programId,
                                areaId: modalData?.areaId,
                                area: modalData?.area,
                                parameterId: modalData?.parameterId,
                                parameter: modalData?.parameter,
                                taskForceId: tf?.id,
                                taskForceUUID: tf?.uuid,
                                taskForce: tf.fullName,
                                taskForceImage: tf.profilePic,
                                taskForces: modalData.taskForces
                              })}
                              key={index} 
                              className='flex items-center justify-start gap-x-2 rounded-lg p-2 hover:bg-slate-700 w-full cursor-pointer active:scale-98'>
                              <Icon />
                              <span>{item.label}</span>
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )) : (
              <div className='relative flex justify-center bg-slate-100 px-3 py-2 rounded-lg'>
                <p>No task force assigned.</p>
              </div>
            )}
            <button 
              onClick={handleAddTaskForceClick}
              className='flex items-center gap-2 py-2 justify-center bg-green-600 text-slate-100 mt-4 rounded-lg cursor-pointer hover:bg-green-700 active:scale-95 transition'>
              <Plus />
              <span>Add</span>
            </button>
            {modalData?.taskForces.length > 1 && (
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
      {showConfirmUnassign && (
        <ConfirmationModal 
          onClose={() => handleCloseModal({ confirmUnassign: true })}
          onCancelClick={() => handleCloseModal({ confirmUnassign: true })}
          onConfirmClick={() => handleConfirmUnassign({ 
            accredInfoId: modalData.accredInfoId, 
            levelId: modalData.levelId, 
            programId: modalData.programId, 
            areaId: modalData.areaId, 
            parameterId: modalData.parameterId,
            taskForceId: modalData.selectedTaskForce.id 
          })}
          primaryButton={'Unassign'}
          secondaryButton={'Cancel'}
          bodyContent={
            <div className='flex flex-col gap-4 items-center justify-center mb-8'>
              <img 
                src={`${PROFILE_PIC_PATH}/${modalData.selectedTaskForce.profilePic}`} 
                alt={`${modalData.selectedTaskForce.fullName} Profile`} 
                className='border-3 border-green-600 h-24 w-24 rounded-full'
                loading='lazy'
              />
              <p className='text-center px-4'>
                <span className='font-medium'>
                  {modalData.selectedTaskForce.fullName} {' '}
                </span> 
                will be unassign from {' '}
                <span className='font-medium'>
                  {modalData[scope]} {' '}
                </span>
                and remove the documents he/she uploaded.
              </p>
              <p>
                Do you want to proceed?
              </p>
            </div>
          }
        />
      )}
    </>
  )
}

export default VATFModal
