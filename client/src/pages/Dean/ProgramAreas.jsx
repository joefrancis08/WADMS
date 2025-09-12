import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import ContentHeader from '../../components/Dean/ContentHeader';
import { ChevronRight, EllipsisVertical, FileUser, FolderOpen, FolderPen, Folders, Plus } from 'lucide-react';
import PATH from '../../constants/path';
import useProgramAreas from '../../hooks/Dean/useProgramAreas';
import AreaModal from '../../components/Dean/AreaModal';
import Dropdown from '../../components/Dropdown/Dropdown';

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
    programName,
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
    handleAreaOptionClick
  } = handlers

  const areaOptions = [
    { icon: <Folders />, label: 'View Parameters' },
    { icon: <FileUser />, label: 'Assign Task Force'},
    { icon: <FolderPen />, label: 'Rename'}
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

        <div className='flex justify-between px-4 pt-4'>
          <p className='flex flex-row items-center'>
            <span
              title='Back to Programs'
              onClick={() => navigate(PATH.DEAN.PROGRAMS_TO_BE_ACCREDITED)}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              {formattedLevel} - {programName}
            </span>
            <ChevronRight className='h-5 w-5' />
            <span className='font-semibold'>{data.length > 1 ? 'Areas' : 'Area'}</span>
          </p>
        </div>

        <div className='flex justify-end px-5 py-3'>
          <button onClick={handleAddAreaClick} title='Add Areas' className='cursor-pointer hover:opacity-80 active:opacity-50'>
            <Plus className='h-8 w-8' />
          </button>
        </div>

        <div className='flex flex-wrap gap-4 justify-center mb-8'>
          {!data.length && <p>No data to display.</p>}

          {data.map(({ area_uuid, area }) => (
            <div
              key={area_uuid}
              onClick={() => handleAreaCardClick(area_uuid)}
              className='relative flex flex-col items-start justify-start border py-8 px-4 w-75 rounded-md transition-all cursor-pointer shadow hover:shadow-lg active:opacity-50'
            >
              {String(area)
                .toUpperCase()
                .split(/[:-]/)
                .map((s, i) => (
                  <p key={i} className={i === 0 ? 'text-xl font-bold' : 'text-md text-slate-700 font-semibold'}>
                    {s.trim()}
                  </p>
                ))}
              <button
                onClick={(e) => handleAreaOptionClick(e, { areaID: area_uuid })}
                title='Options'
                className='absolute top-2 right-1 cursor-pointer hover:opacity-80 active:opacity-50 rounded-full hover:bg-slate-200 p-2'
              >
                <EllipsisVertical className='h-5 w-5' />
              </button>
              {activeAreaId === area_uuid && (
                <div ref={areaOptionsRef} className='absolute top-10 left-12 shadow-md'>
                  <Dropdown 
                    width={'w-60'} 
                    border={'border border-slate-600 rounded-lg bg-slate-800'}
                  >
                    {areaOptions.map((item, index) => (
                      <p 
                        onClick={() => console.log('Clicked')}
                        key={index}
                        className='flex p-2 hover:bg-slate-200 rounded-md'
                      >
                        {item.icon}
                        <span className='ml-2'>
                          {item.label}
                        </span>
                      </p>
                    ))}
                  </Dropdown>
                </div>
              )}
            </div>
          ))}
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
