import { LoaderCircle, Plus, UserRoundX } from 'lucide-react';
import React from 'react';

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const ATFModalBody = ({ data = {}, handlers = {} }) => {
  const { taskForce, taskForceLoading, selectedTaskForce } = data;
  const { handleSelectAll, handleCheckboxChange } = handlers;

  return (
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
  );
};

export default ATFModalBody;
