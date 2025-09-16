import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import ContentHeader from '../../components/Dean/ContentHeader';
import { ChevronRight, EllipsisVertical, FileUser, FolderOpen, FolderPen, Folders, Plus, Trash2, Upload } from 'lucide-react';
import PATH from '../../constants/path';
import useProgramAreas from '../../hooks/Dean/useProgramAreas';
import AreaModal from '../../components/Dean/AreaModal';
import Dropdown from '../../components/Dropdown/Dropdown';
import React from 'react';

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
  const { modalType } = modals;
  const { 
    data, 
    loading, 
    error, 
    formattedLevel, 
    program,
    activeAreaId
  } = datas;
  const {
    handleAreaInputChange,
    handleAddAreaClick,
    handleCloseModal,
    handleAddAreaValue,
    handleRemoveAreaValue,
    handleSaveAreas,
    handleAreaCardClick,
    handleAreaOptionClick,
    handleOptionItemClick
  } = handlers

  const areaOptions = [
    { icon: <Folders />, label: 'View Parameters' },
    { icon: <FileUser />, label: 'Assign Task Force'},
    { icon: <FolderPen />, label: 'Rename'},
    { icon: <Trash2 />, label: 'Remove'}
  ];
  return (
    <DeanLayout>
      <div className='flex-1'>
        <ContentHeader
          headerIcon={FolderOpen}
          headerTitle='Areas'
          searchTitle='Search Areas'
          placeholder='Search Areas...'
          condition
        />
        <div className='rounded-lg border border-white pb-2'>
          <div className='flex justify-between px-4 pt-4 max-md:hidden'>
            <p className='flex flex-row items-center'>
              <span
                title='Back to Programs'
                onClick={() => navigate(PATH.DEAN.PROGRAMS_TO_BE_ACCREDITED)}
                className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
              >
                Programs
              </span>
              <ChevronRight className='h-5 w-5' />
              <span className='font-semibold'>{data.length > 1 ? 'Areas' : 'Area'}</span>
            </p>
          </div>
          <div className='flex items-center justify-center mt-4 max-md:mt-10 w-[85%] md:w-[75%] lg:w-[50%] mx-auto'>
            <p className='relative text-center'>
              <span className='text-green-600 font-bold text-lg md:text-xl lg:text-2xl tracking-wide text-center'>
                {program}
              </span>
              
              <span className='absolute -top-7 left-1/2 -translate-x-1/2 text-md px-2 bg-green-700 text-white font-bold'>
                {formattedLevel}
              </span>
            </p>
          </div>
          <hr className='mt-4 w-[40%] mx-auto border text-green-500'></hr>
          <div className='max-md:hidden flex justify-end px-5 p-2'>
            <button 
              onClick={handleAddAreaClick} 
              className='flex gap-2 text-white text-sm lg:text-base justify-center items-center cursor-pointer rounded-full px-4 py-2 hover:opacity-90 active:opacity-80 bg-green-600 shadow hover:shadow-md'>
              <Plus className='h-6 w-6' />
              Add Areas
            </button>
          </div>
          <div className={`flex flex-wrap gap-8 justify-center mb-8 bg-slate-100 shadow-md shadow-slate-400 py-8 px-2 mx-2 rounded
            ${data.length ? 'items-start' : 'items-center'}
          `}>
            {!data.length && <p>No areas to display.</p>}

            {data.map(({ area_uuid, area }) => (
              <div
                key={area_uuid}
                onClick={() => !activeAreaId && handleAreaCardClick(area_uuid)}
                className='relative flex flex-col items-start justify-center px-2 max-sm:w-full md:w-75 lg:w-50 h-60 bg-[url("/cgs-bg-2.png")] bg-cover bg-center shadow-slate-400 shadow hover:shadow-lg transition-all cursor-pointer active:shadow'
              >
                <div className='absolute inset-0 bg-black/50'></div>
                {String(area)
                  .toUpperCase()
                  .split(/[:-]/)
                  .map((s, i) => (
                    <div className='flex items-center justify-center z-20'>
                      <p 
                        key={i} 
                        className={`z-20 ${i === 0 
                        ? 'text-md font-bold text-white bg-yellow-400 py-1 px-5 shadow-md absolute top-3 left-3' 
                        : 'text-xl p-2 mt-5 tracking-wide text-white font-semibold'}`}>
                        {s.trim()}
                      </p>
                    </div>
                  ))}
                <button
                  onClick={(e) => handleAreaOptionClick(e, { areaID: area_uuid })}
                  title='Options'
                  className='absolute top-2 right-1 text-white cursor-pointer active:opacity-50 rounded-full hover:bg-yellow-400/50 p-2 z-40'
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
                {activeAreaId === area_uuid && (
                  <>
                    <div className='absolute inset-0 z-20'></div>
                    <div ref={areaOptionsRef} className='absolute top-10 -left-2 flex items-center shadow-md z-30'>
                      <Dropdown 
                        width={'w-50'} 
                        border={'border border-slate-300 rounded-lg bg-slate-800'}
                      >
                        {areaOptions.map((item, index) => (
                          <React.Fragment key={index}>
                            {item.label === 'Remove' && (
                              <hr className='my-1 mx-auto w-[90%] text-slate-300'></hr>
                            )}
                            <p 
                              onClick={(e) => handleOptionItemClick(e, { label: item.label })}
                              className={`flex p-2 rounded-md text-sm
                                ${item.label === 'Remove' 
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
          duplicateValues 
        }}
        handlers={{
          handleCloseModal,
          handleSaveAreas,
          handleAreaInputChange,
          handleAddAreaValue,
          handleRemoveAreaValue
        }}
      />
    </DeanLayout>
  );
};

export default ProgramAreas;
