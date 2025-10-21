import React, { useState, useMemo } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import {
  FolderOpen,
  CirclePlus,
  Plus,
  Search,
  FileUser,
  EllipsisVertical,
} from 'lucide-react';
import PATH from '../../constants/path';
import formatAreaName from '../../utils/formatAreaName';
import useAreaParameters from '../../hooks/Dean/useAreaParameters';
import ParameterModal from '../../components/Dean/Accreditation/Parameter/ParameterModal';
import formatParameter from '../../utils/formatParameter';
import { MENU_OPTIONS } from '../../constants/user';
import Dropdown from '../../components/Dropdown/Dropdown';
import Popover from '../../components/Popover';
import ProfileStack from '../../components/ProfileStack';
import deduplicateAssignments from '../../utils/deduplicateAssignments';
import Breadcrumb from '../../components/Breadcrumb';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import ProgressBar from '../../components/ProgressBar';
import { getProgressStyle } from '../../helpers/progressHelper';

const { PROGRAMS_TO_BE_ACCREDITED, PROGRAM_AREAS, PARAM_SUBPARAMS } = PATH.DEAN;

const AreaParameters = () => {
  const {
    params,
    navigation,
    refs,
    datas,
    modals,
    inputs,
    handlers,
  } = useAreaParameters();

  const { accredInfoUUID, level, programUUID, areaUUID, paramOptionRef } = params;
  const { navigate } = navigation;
  const { parameterInputRef, assignedTaskForceRef } = refs;
  const { modalType, modalData } = modals;
  const { parameterInput } = inputs;

  const {
    parameterData,
    paramsByAreaIdData,
    parametersArr,
    duplicateValues,
    title,
    year,
    area,
    program,
    levelName,
    hoveredId,
    taskForce,
    taskForceLoading,
    taskForceError,
    taskForceRefetch,
    selectedTaskForce,
    assignmentData,
    activeTaskForceId,
    showConfirmUnassign,
    activeParamId,
    paramProgress,
    loadingParamProgress,
    errorParamProgress
  } = datas;

  const {
    handleCloseModal,
    handlePlusClick,
    handleParameterChange,
    handleAddParameterValue,
    handleRemoveParameterValue,
    handleSaveParameters,
    handleParamOptionClick,
    handleOptionItem,
    handleConfirmDelete,
    handleMouseEnter,
    handleMouseLeave,
    handleCheckboxChange,
    handleSelectAll,
    handleAssignTaskForce,
    handleFileUserClick,
    handleProfileStackClick,
    handleATFEllipsisClick,
    handleAddTaskForceClick,
    handleUnassignedAllClick,
    handleAssignedOptionsClick,
    handleConfirmUnassign,
  } = handlers;

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);
  const lowerQ = debouncedQuery.toLowerCase();

  // Filter parameters by search query
  const filteredParameters = useMemo(() => {
    if (!lowerQ) return parameterData;
    return parameterData.filter((p) =>
      p.parameter.toLowerCase().includes(lowerQ)
    );
  }, [parameterData, lowerQ]);

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
      label: formatAreaName(area),
      onClick: () => {
        localStorage.removeItem('modal-type');
        localStorage.removeItem('modal-data');
        navigate(PROGRAM_AREAS({ accredInfoUUID, level, programUUID }));
      },
    },
    {
      label: parameterData.length > 1 ? 'Parameters' : 'Parameter',
      isActive: true,
    },
  ];

  return (
    <DeanLayout>
      <div className='flex-1 p-3'>
        <div className='bg-slate-900 m-2 pb-2 border border-slate-700 rounded-lg'>
          {/* Header: Breadcrumb + Search */}
          <div className='flex flex-col md:flex-row md:items-center md:justify-between shadow px-4 pt-4 bg-black/40 p-4 rounded-t-lg gap-4'>
            <Breadcrumb items={breadcrumbItems} />
            <div className='relative w-full md:w-1/3 lg:w-1/4'>
              <Search className='absolute left-3 top-2.5 h-5 w-5 text-slate-400' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search parameter...'
                className='pl-10 pr-3 py-2 rounded-full bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-full transition-all'
              />
            </div>
          </div>

          {/* Program + Area Display */}
          <div className='flex items-center justify-center mt-6 mb-8 w-auto mx-auto'>
            <p className='relative text-center w-full'>
              <span className='text-yellow-400 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide'>
                {program}
              </span>
              <span className='absolute -bottom-10 right-1/2 translate-x-1/2 text-xs md:text-lg px-6 bg-green-700 text-white font-medium'>
                {levelName} &#8226; {formatAreaName(area)}
              </span>
            </p>
          </div>

          {/* Parameters List */}
          <div
            className={`flex flex-wrap gap-8 justify-center mb-8 py-8 px-4 mx-2 rounded ${
              filteredParameters.length ? 'items-start' : 'items-center'
            }`}
          >
            {/* Empty State */}
            {!filteredParameters.length && (
              <div className='flex flex-col items-center justify-center text-center'>
                <FolderOpen className='text-slate-600' size={160} />
                <p className='text-lg font-medium text-slate-300 mt-2'>
                  {parameterData.length === 0
                    ? `No parameters to display for ${formatAreaName(area)}.`
                    : `No parameters found for “${searchQuery}”.`}
                </p>
                <div className='max-md:hidden flex justify-center p-2 mt-3'>
                  <button
                    onClick={handlePlusClick}
                    className='flex gap-x-1 text-white text-sm lg:text-base justify-center items-center cursor-pointer rounded-full px-5 py-2 hover:opacity-90 active:scale-98 border-3 border-slate-500 bg-slate-700/50 shadow hover:shadow-md hover:border-green-600 transition'
                  >
                    <Plus className='h-6 w-6' />
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Parameter Cards */}
            {filteredParameters.map((data) => {
              const { label, content } = formatParameter(data.parameter);
              const accredInfoId = data.accredInfoId;
              const levelId = data.levelId;
              const programId = data.programId;
              const areaId = data.areaId;
              const parameterId = data.parameter_id;
              return (
                <div
                  key={data.parameter_uuid}
                  onClick={() => {
                    navigate(
                      PARAM_SUBPARAMS({
                        accredInfoUUID,
                        level,
                        programUUID,
                        areaUUID,
                        parameterUUID: data.parameter_uuid,
                      })
                    );
                    localStorage.removeItem('modal-type');
                    localStorage.removeItem('modal-data');
                  }}
                  className='flex flex-col mb-8 justify-between border border-slate-600 hover:shadow-lg hover:cursor-pointer shadow-slate-800 transition rounded-md bg-slate-800 p-5 w-full h-45 sm:w-[45%] lg:w-[30%] relative'
                >
                  {/* Top Row: Label + Ellipsis */}
                  {activeParamId && <div className='absolute inset-0 z-20'></div>}
                  <div className='flex items-center justify-between'>
                    <h3
                      className='font-semibold text-lg text-slate-300 cursor-pointer'
                      onClick={() => {
                        navigate(
                          PARAM_SUBPARAMS({
                            accredInfoUUID,
                            level,
                            programUUID,
                            areaUUID,
                            parameterUUID: data.parameter_uuid,
                          })
                        );
                        localStorage.removeItem('modal-type');
                        localStorage.removeItem('modal-data');
                      }}
                    >
                      {label}
                    </h3>

                    {/* Ellipsis */}
                    <button
                      onClick={(e) =>
                        handleParamOptionClick(e, {
                          paramId: data.parameter_uuid,
                        })
                      }
                      title='Options'
                      className={`text-white hover:bg-slate-700 ${activeParamId === data.parameter_uuid && 'bg-slate-700'} p-1 rounded-full transition cursor-pointer`}
                    >
                      <EllipsisVertical className='h-5 w-5' />
                    </button>
                  </div>

                  {/* Parameter Content */}
                  <div
                    onMouseEnter={(e) => handleMouseEnter(e, data.parameter_uuid)}
                    onMouseLeave={(e) => handleMouseLeave(e)}
                    className='relative cursor-pointer'
                  >
                    <p className='text-white text-xl font-semibold truncate'>
                      {content}
                    </p>
                    {hoveredId === data.parameter_uuid && <Popover content={content} />}
                  </div>
                  
                  <hr className={`text-slate-700 mt-4`}></hr>

                  {/* Bottom: Task Force + FileUser */}
                  <div className='relative h-7 flex items-center justify-between'>
                    <ProfileStack
                      data={{
                        assignmentData: deduplicateAssignments(assignmentData, 'parameter'),
                        taskForce,
                        accredInfoId,
                        levelId,
                        programId,
                        parameterId,
                      }}
                      handlers={{ handleProfileStackClick }}
                      scope='parameter'
                      showBorder={true}
                    />

                    <button
                      title='Assign Task Force'
                      onClick={(e) =>
                        handleFileUserClick(e, {
                          parameterId: data.parameter_id,
                          parameter: data.parameter,
                        })
                      }
                      className='absolute right-0 text-white hover:bg-white/20 p-1 rounded-full transition cursor-pointer'
                    >
                      <FileUser />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  {loadingParamProgress ? (
                    <p className='mt-4 text-sm text-slate-400'>Loading progress...</p>
                  ) : errorParamProgress ? (
                    <p className='mt-4 text-sm text-red-400'>Error loading progress</p>
                  ) : (() => {
                    if (!paramProgress || !Array.isArray(paramProgress)) return null;
                      
                      const matchedProgress = paramProgress.find(
                        (item) =>
                          Number(item.apmId) === Number(data.apmId) &&
                          Number(item.areaId) === Number(data.areaId) &&
                          Number(item.parameterId) === Number(data.parameter_id)
                      );

                      console.log(matchedProgress);

                      if (!matchedProgress) return null;

                      const progress = Number(matchedProgress.progress || 0).toFixed(1);
                      const { status, color } = getProgressStyle(progress);

                      return (
                        <ProgressBar 
                          progress={progress} 
                          color={color} 
                          status={status}
                        />
                      );
                    })()}

                  {/* Dropdown */}
                  {activeParamId === data.parameter_uuid && (
                    <div ref={paramOptionRef} className='absolute left-36 top-12 z-30'>
                      <Dropdown
                        width={'w-48'}
                        border={'border border-slate-300 rounded-lg bg-slate-800'}
                      >
                        {MENU_OPTIONS.DEAN.PARAMETER_OPTIONS.map((item) => {
                          const Icon = item.icon;
                          return (
                            <React.Fragment key={item.id}>
                              {item.label === 'Delete' && (
                                <hr className='my-1 mx-auto w-[90%] text-slate-300' />
                              )}
                              <p
                                onClick={(e) =>
                                  handleOptionItem(e, {
                                    label: item.label,
                                    apmId: data.apmId,
                                    parameterId: data.parameter_id,
                                    paramUUID: data.parameter_uuid,
                                    parameter: data.parameter,
                                  })
                                }
                                className={`flex items-center gap-2 p-2 rounded-md text-sm cursor-pointer active:scale-99 transition ${
                                  item.label === 'Delete'
                                    ? 'hover:bg-red-200 text-red-600'
                                    : 'hover:bg-slate-200 text-slate-800'
                                }`}
                              >
                                <Icon />
                                <span>{item.label}</span>
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

            {/* Add Parameter Button */}
            {filteredParameters.length > 0 && (
              <div
                onClick={handlePlusClick}
                className='flex flex-col gap-y-2 items-center justify-center border border-slate-700 hover:shadow-lg shadow-slate-800 p-4 rounded-md transition cursor-pointer bg-slate-800 active:opacity-90 w-full h-45 sm:w-[45%] lg:w-[30%] py-12 text-slate-100 active:scale-98'
              >
                <CirclePlus className='h-12 w-12 flex shrink-0' />
                <p>Add Parameter</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parameter Modal */}
      <ParameterModal
        modalType={modalType}
        refs={{ parameterInputRef, assignedTaskForceRef }}
        inputs={{ parameterInput }}
        datas={{
          parametersArr,
          duplicateValues,
          modalData,
          taskForce,
          paramsByAreaIdData,
          taskForceLoading,
          taskForceError,
          taskForceRefetch,
          selectedTaskForce,
          activeTaskForceId,
          showConfirmUnassign,
        }}
        handlers={{
          handleCloseModal,
          handleSaveParameters,
          handleAddParameterValue,
          handleRemoveParameterValue,
          handleParameterChange,
          handleConfirmDelete,
          handleCheckboxChange,
          handleSelectAll,
          handleAssignTaskForce,
          handleATFEllipsisClick,
          handleAddTaskForceClick,
          handleUnassignedAllClick,
          handleAssignedOptionsClick,
          handleConfirmUnassign,
        }}
      />
    </DeanLayout>
  );
};

export default AreaParameters;
