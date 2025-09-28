import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { Archive, ChevronRight, EllipsisVertical, FileUser, FolderOpen, FolderPen, Folders, Plus, PlusCircle, Trash2, Upload } from 'lucide-react';
import PATH from '../../constants/path';
import useProgramAreas from '../../hooks/Dean/useProgramAreas';
import AreaModal from '../../components/Dean/Accreditation/Area/AreaModal';
import Dropdown from '../../components/Dropdown/Dropdown';
import React from 'react';
import formatArea from '../../utils/formatArea';
import formatAreaName from '../../utils/formatAreaName';

const ProgramAreas = () => {
  const {
    navigation,
    datas,
    inputs,
    refs,
    values,
    modals,
    handlers
  } = useProgramAreas();

  const { navigate } = navigation;
  const { areas, areaInput } = inputs;
  const { areaInputRef, areaOptionsRef } = refs;
  const { duplicateValues } = values;
  const { modalType, modalData } = modals;
  const { 
    title,
    year,
    accredBody,
    data,
    areasByLevelData, 
    loading, 
    error, 
    formattedLevel, 
    program,
    activeAreaId,
    taskForce,
    taskForceLoading,
    taskForceError,
    selectedTaskForce
  } = datas;
  const {
    handleAreaInputChange,
    handleAddAreaClick,
    handleCloseModal,
    handleAddAreaValue,
    handleRemoveAreaValue,
    handleRemoveAllAreas,
    handleSaveAreas,
    handleAreaCardClick,
    handleAreaOptionClick,
    handleOptionItemClick,
    handleConfirmRemoval,
    handleCheckboxChange,
    handleSelectAll,
    handleAssignTaskForce
  } = handlers

  const areaOptions = [
    { icon: <Folders />, label: 'View Parameters' },
    { icon: <FileUser />, label: 'Assign Task Force'},
    { icon: <FolderPen />, label: 'Rename'},
    { icon: <Archive />, label: 'Move to Archive'},
    { icon: <Trash2 />, label: 'Delete'},
  ];
  return (
    <DeanLayout>
      <div className='flex-1 p-3'>
        <div className='bg-slate-900 m-2 pb-2 border border-slate-700 rounded-lg'>
          <div className='flex justify-between shadow px-4 pt-4 bg-black/40 p-4 rounded-t-lg'>
            <p className='flex flex-row items-center text-lg text-slate-100 '>
              <span
                title='Back to Programs'
                onClick={() => navigate(PATH.DEAN.PROGRAMS_TO_BE_ACCREDITED)}
                className='hover:underline cursor-pointer transition-all'
              >
                Programs
              </span>
              <ChevronRight className='h-6 w-6 mx-2 text-slate-100' />
              <span className='font-semibold'>{data.length > 1 ? 'Areas' : 'Area'}</span>
            </p>
          </div>
          <div className='flex items-center justify-center mt-4 max-md:mt-10 w-[85%] md:w-[75%] lg:w-[50%] mx-auto'>
            <p className='relative text-center'>
              <span className='text-green-400 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide text-center'>
                {program}
              </span>
              
              <span className='absolute -bottom-10 left-1/2 -translate-x-1/2 text-lg px-2 bg-green-700 text-white font-bold'>
                {formattedLevel}
              </span>
            </p>
          </div>
          <hr className='mt-6 w-[30%] mx-auto border text-green-500'></hr>
          <div className={`flex flex-wrap gap-10 justify-center mb-8 py-8 px-2 mx-2 rounded
            ${data.length ? 'items-start' : 'items-center'}
          `}>
            {!data.length && (
              <div className='flex flex-col items-center justify-center'>
                <FolderOpen className='text-slate-600' size={200}/>
                <p className='text-lg text-slate-100'>
                  No areas yet. Click 'Add' to create one.
                </p>
                <button 
                  onClick={handleAddAreaClick} 
                  className='flex gap-1 text-white text-sm lg:text-base justify-center items-center cursor-pointer rounded-full mt-4 px-5 py-2 hover:opacity-90 active:opacity-80 bg-green-600 shadow hover:shadow-md active:scale-95 transition'>
                  <Plus className='h-6 w-6' />
                  Add
                </button>
              </div>
            )}

            {data.map((data, index) => (
              <div
                key={index}
                onClick={() => !activeAreaId && handleAreaCardClick(data.area_uuid)}
                className='relative flex flex-col items-start justify-center px-2 max-sm:w-full md:w-75 lg:w-50 h-60 bg-[url("/cgs-bg-2.png")] bg-cover bg-center shadow-slate-800 border border-slate-600 hover:shadow hover:scale-105 transition cursor-pointer active:shadow'
              >
                <div className='absolute inset-0 bg-black/50'></div>
                {String(data.area)
                  .toUpperCase()
                  .split(/[:-]/)
                  .map((s, i) => (
                    <div 
                      key={i} 
                      className={`flex ${i === 0 ? '' : 'justify-center'} w-full z-20`}
                    >
                      <p 
                        className={`${
                          i === 0 
                            ? 'text-md text-center font-bold text-white bg-yellow-400 py-1 px-5 shadow-md absolute top-10 w-30 left-1/2 -translate-x-1/2' 
                            : 'text-xl text-center mt-5 tracking-wide text-white font-semibold'
                        }`}
                      >
                        {s.trim()}
                      </p>
                    </div>
                ))}

                <button
                  onClick={(e) => handleAreaOptionClick(e, { areaID: data.area_uuid })}
                  title='Options'
                  className='absolute top-0 right-0 text-white cursor-pointer active:opacity-50 rounded-full hover:bg-slate-200/20 p-2 z-10'
                >
                  <EllipsisVertical className='h-5 w-5' />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  title='Upload document'
                  className='absolute bottom-2 right-1 text-white cursor-pointer active:opacity-50 rounded-full hover:bg-white/20 p-2'
                >
                  <Upload />
                </button>
                {activeAreaId && <div className='absolute inset-0 z-20'></div>}
                {activeAreaId === data.area_uuid && (
                  <>
                    <div className='absolute inset-0 z-20'></div>
                    <div ref={areaOptionsRef} className='absolute top-8 -left-2 flex items-center shadow-md z-30'>
                      <Dropdown 
                        width={'w-50'} 
                        border={'border border-slate-300 rounded-lg bg-slate-800'}
                      >
                        {areaOptions.map((item, index) => (
                          <React.Fragment key={index}>
                            {item.label === 'Delete' && (
                              <hr className='my-1 mx-auto w-[90%] text-slate-300'></hr>
                            )}
                            <p 
                              onClick={(e) => handleOptionItemClick(e, { 
                                label: item.label,
                                accredId: data.accredId,
                                title,
                                year,
                                accredBody,
                                levelId: data.levelId,
                                level: formattedLevel,
                                programId: data.programId,
                                program,
                                areaId: data.area_id,
                                areaUUID: data.area_uuid,
                                area: formatAreaName(data.area)
                              })}
                              className={`flex items-center p-2 rounded-md text-sm
                                ${item.label === 'Delete' 
                                  ? 'hover:bg-red-200 text-red-600' 
                                  : 'hover:bg-slate-200'}`}
                            >
                              {item.icon}
                              <span className='ml-2'>
                                {item.label}
                              </span>
                            </p>
                          </React.Fragment>
                        ))}
                      </Dropdown>
                    </div>
                  </>
                )}
              </div>
            ))}
            {data.length > 0 && (
              <button
                onClick={handleAddAreaClick}
                className='relative flex flex-col items-center rounded-lg gap-4 justify-center px-2 max-sm:w-full md:w-75 lg:w-50 h-60 shadow-slate-800 border bg-slate-800 border-slate-700 hover:shadow hover:scale-105 transition cursor-pointer active:shadow active:scale-95'
              >
                <PlusCircle className='h-16 w-16 text-slate-100'/>
                <p className='text-slate-100 text-lg'>Add Areas</p>
              </button>
            )}
          </div>
        </div>
      </div>
      <AreaModal 
        modalType={modalType}
        refs={{ areaInputRef }}
        inputs={{ areaInput }}
        datas={{ 
          data,
          error,
          loading, 
          areas,
          areasByLevelData,
          modalData, 
          duplicateValues,
          taskForce,
          taskForceLoading,
          taskForceError,
          selectedTaskForce
        }}
        handlers={{
          handleCloseModal,
          handleSaveAreas,
          handleAreaInputChange,
          handleAddAreaValue,
          handleRemoveAreaValue,
          handleRemoveAllAreas,
          handleConfirmRemoval,
          handleCheckboxChange,
          handleSelectAll,
          handleAssignTaskForce
        }}
      />
    </DeanLayout>
  );
};

export default ProgramAreas;
