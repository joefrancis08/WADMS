import React, { useState, useMemo } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import {
  ChevronRight,
  Folder,
  FolderOpen,
  CirclePlus,
  EllipsisVertical,
  FileUser,
  Plus,
  Search
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

  // 🧠 SEARCH STATE
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

  // 🧭 Breadcrumbs
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
      }
    },
    {
      label: parameterData.length > 1 ? 'Parameters' : 'Parameter',
      isActive: true,
    },
  ];

  return (
    <DeanLayout>
      <div className='flex-1 p-3'>
        {/* Wrapper */}
        <div className='bg-slate-900 m-2 pb-2 border border-slate-700 rounded-lg'>
          {/* Header: Breadcrumb + Search */}
          <div className='flex flex-col md:flex-row md:items-center md:justify-between shadow px-4 pt-4 bg-black/40 p-4 rounded-t-lg gap-4'>
            <Breadcrumb items={breadcrumbItems} />

            {/* 🔍 Search bar */}
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

          {/* Program + Area display */}
          <div className='flex items-center justify-center mt-4 max-md:mt-10 w-[85%] md:w-[75%] lg:w-[50%] mx-auto'>
            <p className='relative text-center gap-2 w-full mb-8'>
              <span className='text-yellow-400 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide'>
                {program}
              </span>
              <span className='absolute -bottom-10 right-1/2 translate-x-1/2 text-xs md:text-lg px-4 bg-green-700 text-white font-bold'>
                {levelName} &#8226; {formatAreaName(area)}
              </span>
            </p>
          </div>

          {/* Parameters List */}
          <div
            className={`flex flex-wrap gap-8 justify-center mb-8 py-8 px-2 mx-2 rounded ${
              filteredParameters.length ? 'items-start' : 'items-center'
            }`}
          >
            {/* Empty state */}
            {!filteredParameters.length && (
              <div className='flex flex-col items-center justify-center'>
                <FolderOpen className='text-slate-600' size={200} />
                <p className='text-lg font-medium text-slate-200'>
                  {parameterData.length === 0
                    ? `No parameters to display for ${formatAreaName(area)}.`
                    : `No parameters found for “${searchQuery}”.`}
                </p>
                {/* Add Subparameter Button */}
                <div className='max-md:hidden flex justify-end px-5 p-2 mt-3'>
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
            {filteredParameters.map((data, index) => {
              const { label, content } = formatParameter(data.parameter);
              return (
                <React.Fragment key={index}>
                  <div
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
                    className='relative w-60 h-50 bg-[url("/src/assets/icons/folder.png")] bg-cover bg-center rounded-lg cursor-pointer transition'
                  >
                    <div className='absolute inset-0'></div>
                    <div>
                      <p className='absolute -top-3 left-5 text-white min-w-12 text-center font-bold text-md md:text-md mt-4'>
                        {label}
                      </p>
                      <div
                        onMouseEnter={(e) =>
                          handleMouseEnter(e, data.parameter_uuid)
                        }
                        onMouseLeave={(e) => handleMouseLeave(e)}
                        className='absolute top-25 left-0 w-full px-5 '
                      >
                        <p className='text-white text-lg md:text-xl w-full text-center font-semibold max-w-[500px] truncate'>
                          {content}
                        </p>
                        <div className='z-40'>
                          {hoveredId === data.parameter_uuid && (
                            <Popover content={content} />
                          )}
                        </div>
                      </div>
                      <div className='flex items-center justify-between px-1'>
                        <button
                          title='Assign Task Force'
                          onClick={(e) =>
                            handleFileUserClick(e, {
                              parameterId: data.parameter_id,
                              parameter: data.parameter,
                            })
                          }
                          className='absolute bottom-2.5 right-1 text-white cursor-pointer active:opacity-50 rounded-full hover:bg-white/20 p-1 z-10'
                        >
                          <FileUser />
                        </button>
                        <div className='absolute bottom-2.5 left-1'>
                          <ProfileStack
                            data={{
                              assignmentData: deduplicateAssignments(
                                assignmentData,
                                'parameter'
                              ),
                              taskForce,
                              parameter_id: data.parameter_id,
                            }}
                            handlers={{ handleProfileStackClick }}
                            scope='parameter'
                          />
                        </div>
                      </div>
                    </div>

                    {/* Options Dropdown */}
                    <button
                      onClick={(e) =>
                        handleParamOptionClick(e, { paramId: data.parameter_uuid })
                      }
                      title='Options'
                      className='absolute top-16 right-1 text-white cursor-pointer active:scale-95 rounded-full hover:bg-yellow-500/60 p-1 z-20'
                    >
                      <EllipsisVertical className='h-5 w-5' />
                    </button>

                    {activeParamId && <div className='absolute inset-0 z-20'></div>}
                    {activeParamId === data.parameter_uuid && (
                      <div
                        ref={paramOptionRef}
                        className='absolute top-14 left-2 flex items-center shadow-md z-30'
                      >
                        <Dropdown
                          width={'w-50'}
                          border={'border border-slate-300 rounded-lg bg-slate-800'}
                        >
                          {MENU_OPTIONS.DEAN.PARAMETER_OPTIONS.map((item) => {
                            const Icon = item.icon;
                            return (
                              <React.Fragment key={item.id}>
                                {item.label === 'Delete' && (
                                  <hr className='my-1 mx-auto w-[90%] text-slate-300'></hr>
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
                                  className={`flex items-center p-2 rounded-md text-sm active:scale-99 transition
                                    ${
                                      item.label === 'Delete'
                                        ? 'hover:bg-red-200 text-red-600'
                                        : 'hover:bg-slate-200'
                                    }`}
                                >
                                  <Icon />
                                  <span className='ml-2'>{item.label}</span>
                                </p>
                              </React.Fragment>
                            );
                          })}
                        </Dropdown>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            {/* Add Parameter Card */}
            {filteredParameters.length > 0 && (
              <div
                onClick={handlePlusClick}
                className='relative flex items-center justify-center cursor-pointer hover:scale-102 active:scale-99 transition'
              >
                <Folder className='text-slate-600 fill-slate-600 h-52 w-52 mt-2' />
                <p className='absolute top-1/5 right-1/2 translate-1/2 text-center text-slate-300'>
                  <CirclePlus className='h-12 w-12 text-slate-200' />
                  Add
                </p>
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
