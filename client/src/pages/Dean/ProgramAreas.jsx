import React, { useState, useMemo } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import {
  FolderOpen,
  Plus,
  PlusCircle,
  FileUser,
  EllipsisVertical,
  Upload,
  Search,
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

const { PROGRAMS_TO_BE_ACCREDITED, AREA_PARAMETERS } = PATH.DEAN;

const ProgramAreas = () => {
  const { navigation, params, datas, inputs, refs, values, modals, handlers } =
    useProgramAreas();

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

  // 🔍 SEARCH STATE
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);
  const lowerQ = debouncedQuery.toLowerCase();

  // Filter Areas
  const filteredAreas = useMemo(() => {
    if (!lowerQ) return data;
    return data.filter((area) => {
      const raw = area.area?.toLowerCase() || '';
      const formatted = formatAreaName(area.area)?.toLowerCase() || '';
      return raw.includes(lowerQ) || formatted.includes(lowerQ);
    });
  }, [data, lowerQ]);


  // Breadcrumbs
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
      onClick: () => navigate(PROGRAMS_TO_BE_ACCREDITED),
    },
    {
      label: 'Areas',
      isActive: true,
    },
  ];

  return (
    <DeanLayout>
      <div className="flex-1 p-3">
        <div className="bg-slate-900 m-2 pb-2 border border-slate-700 rounded-lg">
          {/* Header Section: Breadcrumb + Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between shadow px-4 pt-4 bg-black/40 p-4 rounded-t-lg gap-4">
            <Breadcrumb items={breadcrumbItems} />
            <div className="relative w-full md:w-1/3 lg:w-1/4">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area..."
                className="pl-10 pr-3 py-2 rounded-full bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-full transition-all"
              />
            </div>
          </div>

          {/* Program + Level display */}
          <div className="flex items-center justify-center mt-4 max-md:mt-10 w-[85%] md:w-[75%] lg:w-[50%] mx-auto">
            <p className="relative text-center mb-8">
              <span className="text-yellow-400 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide text-center">
                {program}
              </span>
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-lg px-4 bg-green-700 text-white font-bold">
                {formattedLevel}
              </span>
            </p>
          </div>

          {/* Areas List */}
          <div
            className={`flex flex-wrap gap-x-10 gap-y-20 justify-center mb-8 py-8 px-2 mx-2 rounded ${
              filteredAreas.length ? 'items-start' : 'items-center'
            }`}
          >
            {/* Empty state */}
            {!filteredAreas.length && (
              <div className="flex flex-col items-center justify-center">
                <FolderOpen className="text-slate-600" size={200} />
                <p className="text-lg text-slate-100">
                  {data.length === 0
                    ? `No areas yet. Click 'Add' to create one.`
                    : `No areas found for “${searchQuery}”.`}
                </p>
                {/* Add Subparameter Button */}
                <div className='max-md:hidden flex justify-end px-5 p-2 mt-3'>
                  <button
                    onClick={handleAddAreaClick}
                    className='flex gap-x-1 text-white text-sm lg:text-base justify-center items-center cursor-pointer rounded-full px-5 py-2 hover:opacity-90 active:scale-98 border-3 border-slate-500 bg-slate-700/50 shadow hover:shadow-md hover:border-green-600 transition'
                  >
                    <Plus className='h-6 w-6' />
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Area Cards */}
            {filteredAreas.map((areaData, index) => (
              <div
                key={index}
                onClick={() =>
                  !activeAreaId && handleAreaCardClick(areaData.area_uuid)
                }
                className="relative flex flex-col items-start justify-center px-2 max-sm:w-full md:w-75 lg:w-50 h-60 bg-[url('/cgs-bg-2.png')] bg-cover bg-center shadow-slate-800 border border-slate-600 hover:shadow-md transition cursor-pointer active:shadow"
              >
                <div className="absolute inset-0 bg-black/50"></div>
                {activeAreaId && <div className='absolute inset-0 z-20'></div>}

                {/* Area Title */}
                {String(areaData.area)
                  .toUpperCase()
                  .split(/[:-]/)
                  .map((s, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        i === 0 ? '' : 'justify-center'
                      } w-full z-20`}
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

                {/* Options Button */}
                <button
                  onClick={(e) =>
                    handleAreaOptionClick(e, { areaID: areaData.area_uuid })
                  }
                  title="Options"
                  className={`absolute top-1 right-1 text-white cursor-pointer active:opacity-50 rounded-full hover:bg-slate-200/20 p-1 z-10 ${activeAreaId === areaData.area_uuid && 'bg-slate-200/10'}`}
                >
                  <EllipsisVertical className="h-5 w-5" />
                </button>

                {/* Upload button (for level IV) */}
                {areaData.level === LEVEL.LIV && (
                  <button
                    onClick={(e) => e.stopPropagation()}
                    title="Upload document"
                    className="absolute bottom-2 right-1 text-white cursor-pointer active:opacity-50 rounded-full hover:bg-white/20 p-2"
                  >
                    <Upload />
                  </button>
                )}

                {/* Task Force */}
                <div className="flex items-center justify-between px-1">
                  <div className="absolute bottom-2.5 z-20">
                    <ProfileStack
                      data={{
                        assignmentData: deduplicateAssignments(
                          assignmentData,
                          'area'
                        ),
                        taskForce,
                        area_id: areaData.area_id,
                        area: formatAreaName(areaData.area),
                      }}
                      handlers={{ handleProfileStackClick }}
                      scope="area"
                    />
                  </div>
                  <button
                    title="Assign Task Force"
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
                    className="absolute bottom-2.5 right-1 text-white cursor-pointer active:opacity-50 rounded-full hover:bg-white/20 p-1"
                  >
                    <FileUser />
                  </button>
                </div>
                
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
                    <ProgressBar 
                      progress={progress} 
                      color={color} 
                      status={status}
                    />
                  );
                })()}
                {/* Dropdown */}
                {activeAreaId === areaData.area_uuid && (
                  <div
                    ref={areaOptionsRef}
                    className="absolute top-8 -left-2 flex items-center shadow-md z-30"
                  >
                    <Dropdown
                      width={'w-50'}
                      border={
                        'border border-slate-300 rounded-lg bg-slate-800'
                      }
                    >
                      {MENU_OPTIONS.DEAN.AREA_OPTIONS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <React.Fragment key={item.id}>
                            {item.label === 'Delete' && (
                              <hr className="my-1 mx-auto w-[90%] text-slate-300"></hr>
                            )}
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
                              className={`flex items-center p-2 rounded-md text-sm ${
                                item.label === 'Delete'
                                  ? 'hover:bg-red-200 text-red-600'
                                  : 'hover:bg-slate-200'
                              }`}
                            >
                              <Icon />
                              <span className="ml-2">{item.label}</span>
                            </p>
                          </React.Fragment>
                        );
                      })}
                    </Dropdown>
                  </div>
                )}
              </div>
            ))}

            {/* Add Area Card */}
            {filteredAreas.length > 0 && (
              <button
                onClick={handleAddAreaClick}
                className="relative flex flex-col items-center rounded-lg gap-4 justify-center px-2 max-sm:w-full md:w-75 lg:w-50 h-60 shadow-slate-800 border bg-slate-800 border-slate-700 hover:shadow hover:scale-105 transition cursor-pointer active:shadow active:scale-95"
              >
                <PlusCircle className="h-16 w-16 text-slate-100" />
                <p className="text-slate-100 text-lg">Add Area</p>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Area Modal */}
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
