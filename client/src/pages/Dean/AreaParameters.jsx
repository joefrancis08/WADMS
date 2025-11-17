import React, { useState, useMemo } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import {
  FolderOpen,
  Plus,
  Search,
  FileUser,
  EllipsisVertical,
  FolderPlus,
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
  const { params, navigation, refs, datas, modals, inputs, handlers } = useAreaParameters();

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

  // ---------- Search ----------
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);
  const lowerQ = debouncedQuery.toLowerCase();

  const filteredParameters = useMemo(() => {
    if (!lowerQ) return parameterData;
    return parameterData.filter((p) => p.parameter.toLowerCase().includes(lowerQ));
  }, [parameterData, lowerQ]);

  // ---------- Breadcrumbs ----------
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
      },
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
      <div className="flex-1 bg-slate-50">
        {/* Sticky header: breadcrumb + search + add */}
        <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <Breadcrumb items={breadcrumbItems} variant="light" />

            <div className="relative flex w-full items-center gap-2 md:w-[28rem]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parameter..."
                className="w-full rounded-full border border-slate-300 bg-white px-9 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-400"
              />
              <button
                title="Add new parameter"
                onClick={handlePlusClick}
                className="inline-flex min-w-28 cursor-pointer items-center justify-center gap-1 rounded-full bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-emerald-300 transition hover:bg-emerald-500 active:scale-95"
              >
                <FolderPlus className="h-4 w-4" />
                <span>Add New</span>
              </button>
            </div>
          </div>
        </div>

        {/* MATCHED HEADER (like ProgramAreas): centered Program + auto-size pill */}
        <div className="mx-auto mt-6 flex w-[85%] items-center justify-center md:mt-8 md:w-[75%] lg:w-[80%]">
          <p className="relative mb-8 text-center min-w-0">
            <span className="text-lg font-bold tracking-wide text-emerald-800 md:text-2xl lg:text-2xl">
              {program}
            </span>
            {/* Auto-sizing pill (width adjusts to text) */}
            <span
              className="absolute -bottom-7 left-1/2 -translate-x-1/2 inline-flex max-w-[90vw] items-center whitespace-nowrap rounded-full bg-emerald-700 px-4 py-1 text-sm font-bold text-white shadow-sm ring-1 ring-emerald-900/10 md:text-sm"
              title={`${levelName} • ${formatAreaName(area)}`}
            >
              {levelName} &bull; {formatAreaName(area)}
            </span>
          </p>
        </div>

        {/* Parameters list */}
        <div className="mx-auto mb-10 max-w-7xl px-4">
          <div
            className={`mt-2 flex flex-wrap justify-center gap-5 rounded py-2 ${
              filteredParameters.length ? 'items-start' : 'items-center'
            }`}
          >
            {/* Empty state */}
            {!filteredParameters.length && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <FolderOpen className="h-20 w-20 text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  {parameterData.length === 0
                    ? `No parameters to display for ${formatAreaName(area)}.`
                    : `No parameters found for “${searchQuery}”.`}
                </p>

                <div className="mt-3">
                  <button
                    onClick={handlePlusClick}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-800 shadow transition hover:border-emerald-500 hover:bg-slate-50 active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            )}

            {/* Parameter cards — Assign button separated; Options floats beside card */}
            {filteredParameters.map((data) => {
              const { label, content } = formatParameter(data.parameter);
              const accredInfoId = data.accredInfoId;
              const levelId = data.levelId;
              const programId = data.programId;
              const areaId = data.areaId;
              const parameterId = data.parameter_id;
              const childKey = `${accredInfoId}-${levelId}-${programId}-${areaId}-${parameterId}`;

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
                  className="group relative flex w-full max-w-[380px] cursor-pointer flex-col justify-between overflow-visible rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                >
                  {/* Block background clicks while dropdown is open */}
                  {activeParamId && <div className="absolute inset-0 z-10" />}

                  {/* Header: title + menu button */}
                  <div className="mb-1.5 flex items-center justify-between">
                    <h3
                      className="truncate text-sm font-semibold text-slate-900"
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
                      title={label}
                    >
                      Parameter {label}
                    </h3>

                    <button
                      onClick={(e) => handleParamOptionClick(e, { paramId: data.parameter_uuid })}
                      title="Options"
                      className={`rounded-full bg-white p-1.5 text-slate-700 shadow-sm transition hover:bg-slate-50 active:opacity-70 cursor-pointer ${
                        activeParamId === data.parameter_uuid ? 'ring-2 ring-emerald-200' : ''
                      }`}
                    >
                      <EllipsisVertical className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Content with popover on hover */}
                  <div
                    onMouseEnter={(e) => handleMouseEnter(e, data.parameter_uuid)}
                    onMouseLeave={handleMouseLeave}
                    className="relative"
                  >
                    <p className="truncate text-base font-semibold text-slate-900">{content}</p>
                    {hoveredId === data.parameter_uuid && <Popover content={content} />}
                  </div>

                  {/* Progress (compact card) */}
                  {loadingParamProgress ? (
                    <p className="mt-2 text-[11px] text-slate-600">Loading progress...</p>
                  ) : errorParamProgress ? (
                    <p className="mt-2 text-[11px] text-red-600">Error loading progress</p>
                  ) : (() => {
                    if (!paramProgress || !Array.isArray(paramProgress)) return null;

                    const matched = paramProgress.find(
                      (item) =>
                        Number(item.apmId) === Number(data.apmId) &&
                        Number(item.areaId) === Number(data.areaId) &&
                        Number(item.parameterId) === Number(data.parameter_id)
                    );
                    if (!matched) return null;

                    const progress = Number(matched.progress || 0).toFixed(1);
                    const { status, color } = getProgressStyle(progress);

                    return (
                      <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-700">Progress</span>
                          <span className="text-[11px] font-semibold text-slate-700">{progress}%</span>
                        </div>
                        <ProgressBar progress={progress} color={color} status={status} />
                      </div>
                    );
                  })()}

                  {/* Dropdown — floats BESIDE the card (right side on ≥sm, hugs edge on xs) */}
                  {activeParamId === data.parameter_uuid && (
                    <div
                      ref={paramOptionRef}
                      className="absolute z-40 top-11 right-11 sm:ml-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown width="w-56" border="border border-slate-200 rounded-lg bg-white shadow-lg">
                        {MENU_OPTIONS.DEAN.PARAMETER_OPTIONS.map((item) => {
                          const Icon = item.icon;
                          return (
                            <React.Fragment key={item.id}>
                              {item.label === 'Delete' && (
                                <hr className="my-1 mx-auto w-[92%] text-slate-200" />
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
                                className={`flex cursor-pointer items-center rounded-md px-3 py-2 text-sm transition
                                  ${
                                    item.label === 'Delete'
                                      ? 'text-red-600 hover:bg-red-50'
                                      : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                              >
                                <Icon className="h-4 w-4" />
                                <span className="ml-2">{item.label}</span>
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
