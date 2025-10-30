import React, { useState, useMemo } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import {
  FolderOpen,
  Plus,
  FileUser,
  EllipsisVertical,
  Upload,
  Search,
  FolderPlus,
} from 'lucide-react';
import PATH from '../../constants/path';
import useProgramAreas from '../../hooks/Dean/useProgramAreas';
import AreaModal from '../../components/Dean/Accreditation/Area/AreaModal';
import Dropdown from '../../components/Dropdown/Dropdown';
import formatAreaName from '../../utils/formatAreaName';
import LEVEL from '../../constants/accreditationLevels';
import { MENU_OPTIONS } from '../../constants/user';
import ProfileStack from '../../components/ProfileStack';
import deduplicateAssignments from '../../utils/deduplicateAssignments';
import Breadcrumb from '../../components/Breadcrumb';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { getProgressStyle } from '../../helpers/progressHelper';
import ProgressBar from '../../components/ProgressBar';

const { PROGRAMS_TO_BE_ACCREDITED } = PATH.DEAN;

const ProgramAreas = () => {
  const { navigation, params, datas, inputs, refs, values, modals, handlers } = useProgramAreas();

  const { navigate } = navigation;
  const { accredInfoUUID, programUUID, level } = params;
  const { areas, areaInput } = inputs;
  const { areaInputRef, areaOptionsRef, assignedTaskForceRef } = refs;
  const { duplicateValues } = values;
  const { modalType, modalData } = modals;

  const {
    title,
    year,
    accredBody,
    data,
    areasByLevelData,
    formattedLevel,
    program,
    activeAreaId,
    taskForce,
    taskForceLoading,
    taskForceError,
    taskForceRefetch,
    selectedTaskForce,
    assignmentData,
    activeTaskForceId,
    showConfirmUnassign,
    areaProgress
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
    handleAssignTaskForce,
    handleProfileStackClick,
    handleEllipsisClick,
    handleUserCircleClick,
    handleAddTaskForceClick,
    handleUnassignedAllClick,
    handleUnassignedClick,
    handleAssignedOptionsClick,
    handleConfirmUnassign,
  } = handlers;

  // search
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);
  const lowerQ = debouncedQuery.toLowerCase();

  // filter areas
  const filteredAreas = useMemo(() => {
    if (!lowerQ) return data;
    return data.filter((area) => {
      const raw = area.area?.toLowerCase() || '';
      const formatted = formatAreaName(area.area)?.toLowerCase() || '';
      return raw.includes(lowerQ) || formatted.includes(lowerQ);
    });
  }, [data, lowerQ]);

  // breadcrumbs
  const breadcrumbItems = [
    {
      label: `${title} ${year}`,
      onClick: () => {
        localStorage.removeItem('modal-type');
        localStorage.removeItem('modal-data');
        localStorage.removeItem('lastProgramId');
        localStorage.setItem('accreditation-title', `${title} ${year}`);
        navigate(PROGRAMS_TO_BE_ACCREDITED);
      },
    },
    {
      label: program,
      onClick: () => {
        localStorage.removeItem('accreditation-title');
        navigate(PROGRAMS_TO_BE_ACCREDITED);
      }
    },
    {
      label: 'Areas',
      isActive: true,
    },
  ];

  return (
    <DeanLayout>
      <div className='flex-1 bg-slate-50'>

        {/* Sticky header: breadcrumb + search + add (matches Programs) */}
        <div className='sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur'>
          <div className='mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between'>
            <Breadcrumb items={breadcrumbItems} />
            <div className='relative flex w-full items-center gap-2 md:w-[30rem]'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search area...'
                className='w-full rounded-full border border-slate-300 bg-white px-10 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-400'
              />
              <button
                title='Add new area'
                onClick={handleAddAreaClick}
                className='inline-flex min-w-32 cursor-pointer items-center justify-center gap-1 rounded-full bg-emerald-600 px-4 py-2 text-white shadow-sm ring-1 ring-emerald-300 transition hover:bg-emerald-500 active:scale-95'
              >
                <FolderPlus className='h-5 w-5' />
                <span className='text-sm font-medium'>Add New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page header: Program + Level (emerald theme) */}
        <div className='mx-auto mt-6 flex w-[85%] items-center justify-center md:mt-8 md:w-[75%] lg:w-[50%]'>
          <p className='relative mb-8 text-center'>
            <span className='text-lg font-bold tracking-wide text-emerald-800 md:text-2xl lg:text-2xl'>
              {program}
            </span>
            <span className='absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-full bg-emerald-700 px-4 py-1 text-sm font-bold text-white md:text-sm'>
              {formattedLevel}
            </span>
          </p>
        </div>

        {/* Areas grid */}
        <div className='mx-auto mb-10 max-w-7xl px-4'>
          <div
            className={`flex flex-wrap justify-center gap-6 rounded py-4 ${
              filteredAreas.length ? 'items-start' : 'items-center'
            }`}
          >
            {/* Empty state */}
            {!filteredAreas.length && (
              <div className='flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm'>
                <FolderOpen className='h-24 w-24 text-slate-400' />
                <p className='mt-4 text-base font-medium text-slate-700'>
                  {data.length === 0
                    ? 'No areas yet. Click “Add New” to create one.'
                    : `No areas found for “${searchQuery}”.`}
                </p>

                <div className='mt-4'>
                  <button
                    onClick={handleAddAreaClick}
                    className='flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 bg-slate-900/90 px-5 py-2 text-white shadow transition hover:border-emerald-500 hover:bg-slate-900 active:scale-95'
                  >
                    <Plus className='h-5 w-5' />
                    <span className='text-sm font-medium'>Add</span>
                  </button>
                </div>
              </div>
            )}

            {/* Area cards (white card + emerald banner, consistent with Programs) */}
            {filteredAreas.map((areaData, index) => {
              const parts = String(areaData.area).toUpperCase().split(/[:-]/);
              const areaTitle = parts[0]?.trim() || '';
              const areaSubtitle = parts.slice(1).join(':').trim();

              return (
                <div
                  key={index}
                  onClick={() => !activeAreaId && handleAreaCardClick(areaData.area_uuid)}
                  className='relative w-full max-w-[380px] cursor-pointer overflow-visible rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md'
                >
                  {activeAreaId === areaData.area_uuid && <div className='absolute inset-0 z-50'></div>}
                  {/* Emerald banner with title */}
                  <div className='relative overflow-hidden rounded-lg bg-emerald-700 py-6 ring-1 ring-emerald-900/10'>
                    <p className='relative z-10 text-center text-lg font-bold text-white'>{areaTitle}</p>
                    {areaSubtitle && (
                      <p className='relative z-10 mt-1 text-center text-sm font-medium text-emerald-100'>
                        {areaSubtitle}
                      </p>
                    )}
                  </div>

                  {/* Options (top-right) */}
                  <button
                    onClick={(e) => handleAreaOptionClick(e, { areaID: areaData.area_uuid })}
                    title='Options'
                    className={`absolute right-3 top-3 z-30 rounded-full border border-slate-200 bg-white p-1.5 text-slate-700 shadow-sm transition hover:bg-slate-50 active:opacity-70 cursor-pointer ${
                      activeAreaId === areaData.area_uuid ? 'ring-2 ring-emerald-200' : ''
                    }`}
                  >
                    <EllipsisVertical className='h-5 w-5' />
                  </button>

                  {/* Upload (Level IV) */}
                  {areaData.level === LEVEL.LIV && (
                    <button
                      onClick={(e) => e.stopPropagation()}
                      title='Upload document'
                      className='absolute right-3 bottom-3 z-30 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 active:opacity-70 cursor-pointer'
                    >
                      <Upload className='h-5 w-5' />
                    </button>
                  )}

                  {/* Assignees + Assign button */}
                  <div className='mt-4 flex items-center justify-between'>
                    <ProfileStack
                      key={areaData.area_uuid}
                      data={{
                        assignmentData: deduplicateAssignments(assignmentData, 'area'),
                        taskForce,
                        accredInfoId: areaData.accredId,
                        levelId: areaData.levelId,
                        programId: areaData.programId,
                        area_id: areaData.area_id,
                        area: formatAreaName(areaData.area),
                      }}
                      handlers={{ handleProfileStackClick }}
                      scope='area'
                    />

                    <button
                      title='Assign Task Force'
                      onClick={(e) =>
                        handleUserCircleClick(e, {
                          accredId: areaData.accredId,
                          title,
                          year,
                          accredBody,
                          levelId: areaData.levelId,
                          level: formattedLevel,
                          programId: areaData.programId,
                          program,
                          areaId: areaData.area_id,
                          areaUUID: areaData.area_uuid,
                          area: formatAreaName(areaData.area),
                        })
                      }
                      className='rounded-full border border-slate-200 bg-white p-1.5 text-slate-700 shadow-sm transition hover:bg-slate-50 active:opacity-70 cursor-pointer'
                    >
                      <FileUser className='h-5 w-5' />
                    </button>
                  </div>

                  {/* Progress (matches compact block style used elsewhere) */}
                  {(() => {
                    if (!areaProgress || !Array.isArray(areaProgress)) return null;
                    const matchedProgress = areaProgress.find(
                      (item) =>
                        Number(item.programId) === Number(areaData.programId) &&
                        Number(item.areaId) === Number(areaData.area_id) &&
                        Number(item.pamId) === Number(areaData.pamId)
                    );
                    if (!matchedProgress) return null;

                    const progress = Number(matchedProgress.progress || 0).toFixed(1);
                    const { color, status } = getProgressStyle(progress);

                    return (
                      <div className='mt-3 rounded-lg border border-slate-200 bg-white p-3'>
                        <div className='mb-1.5 flex items-center justify-between'>
                          <span className='text-xs font-semibold text-slate-700'>Progress</span>
                          <span className='text-xs font-semibold text-slate-700'>{progress}%</span>
                        </div>
                        <ProgressBar progress={progress} color={color} status={status} />
                      </div>
                    );
                  })()}

                  {/* Dropdown (anchored; high z-index; click-through blocked) */}
                  {activeAreaId === areaData.area_uuid && (
                    <div
                      ref={areaOptionsRef}
                      className='absolute right-3 top-11 z-[60]'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown width='w-56' border='border border-slate-200 rounded-lg bg-white shadow-lg'>
                        {MENU_OPTIONS.DEAN.AREA_OPTIONS.map((item) => {
                          const Icon = item.icon;
                          return (
                            <React.Fragment key={item.id}>
                              {item.label === 'Delete' && <hr className='my-1 mx-auto w-[92%] text-slate-200' />}
                              <p
                                onClick={(e) =>
                                  handleOptionItemClick(e, {
                                    label: item.label,
                                    accredId: areaData.accredId,
                                    title,
                                    year,
                                    accredBody,
                                    levelId: areaData.levelId,
                                    level: formattedLevel,
                                    programId: areaData.programId,
                                    program,
                                    areaId: areaData.area_id,
                                    areaUUID: areaData.area_uuid,
                                    area: areaData.area,
                                  })
                                }
                                className={`flex cursor-pointer items-center rounded-md px-3 py-2 text-sm transition ${
                                  item.label === 'Delete'
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <Icon className='h-4 w-4' />
                                <span className='ml-2'>{item.label}</span>
                              </p>
                            </React.Fragment>
                          );
                        })}
                      </Dropdown>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal (unchanged functionality) */}
      <AreaModal
        navigation={{ navigate }}
        modalType={modalType}
        refs={{ areaInputRef, assignedTaskForceRef }}
        inputs={{ areaInput }}
        datas={{
          accredInfoUUID,
          level,
          programUUID,
          data,
          areas,
          modalData,
          areasByLevelData,
          duplicateValues,
          taskForce,
          taskForceLoading,
          taskForceError,
          selectedTaskForce,
          activeTaskForceId,
          showConfirmUnassign,
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
          handleAssignTaskForce,
          handleAddTaskForceClick,
          handleEllipsisClick,
          handleUnassignedClick,
          handleUnassignedAllClick,
          handleAssignedOptionsClick,
          handleConfirmUnassign,
        }}
      />
    </DeanLayout>
  );
};

export default ProgramAreas;
