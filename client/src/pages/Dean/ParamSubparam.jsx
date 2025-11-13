import { useState, useMemo, useEffect } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import {
  FolderOpen,
  FolderPlus,
  Search,
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import PATH from '../../constants/path';
import SubParamModal from '../../components/Dean/Accreditation/SubParameter/SubParamModal';
import PDFViewer from '../../components/PDFViewer';
import SubParamCard from '../../components/Dean/Accreditation/SubParameter/SubParamCard';
import DocumentDropdown from '../../components/Document/DocumentDropdown';
import formatParameterName from '../../utils/formatParameterName';
import formatAreaName from '../../utils/formatAreaName';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { messageHandler } from '../../services/websocket/messageHandler';
import useParamSubparam from '../../hooks/Dean/useParamSubparam';

const { PROGRAMS_TO_BE_ACCREDITED, AREA_PARAMETERS, PROGRAM_AREAS } = PATH.DEAN;

const ParamSubparam = () => {
  const { navigate, modalType, modalData, refs, params, datas, states, handlers } =
    useParamSubparam();

  const { accredInfoUUID, level, programUUID, areaUUID } = params;
  const {
    previewFile,
    setPreviewFile,
    activeDocId,
    renameInput,
    renameDocId,
    loadingFileId,
  } = states;

  const {
    subParamInputRef,
    fileOptionRef,
    renameFileRef,
    subParamOptionRef,
    assignedTaskForceRef,
  } = refs;

  const {
    title,
    year,
    area,
    program,
    levelName,
    subParamsData,
    subParamsByParamIdData,
    subParameterInput,
    subParamsArr,
    duplicateValues,
    documentsBySubParam,
    loadingDocs,
    errorDocs,
    parameter,
    expandedId,
    selectedFiles,
    isRename,
    activeSubParamId,
    taskForce,
    taskForceLoading,
    taskForceError,
    taskForceRefetch,
    selectedTaskForce,
    assignmentData,
    activeTaskForceId,
    showConfirmUnassign,
  } = datas;

  const {
    handleAddSubparamClick,
    handleCloseModal,
    handleSubParamChange,
    handleAddSubParamValue,
    handleRemoveSubParamValue,
    handleSaveSubParams,
    handleSPCardClick,
    toggleExpand,
    handleUploadClick,
    handleFileChange,
    removeSelectedFile,
    handleSaveFile,
    handleFileClick,
    handleFileOptionClick,
    handleRenameClick,
    handleRenameInputChange,
    handleKeyDown,
    handleRemoveClick,
    handleConfirmRemove,
    handleSubParamOption,
    handleSubParamOptionItem,
    handleFileUserClick,
    handleDeleteSubParam,
    handleCheckboxChange,
    handleSelectAll,
    handleAssignTaskForce,
    handleProfileStackClick,
    handleAddTaskForceClick,
    handleATFEllipsisClick,
    handleUnassignedAllClick,
    handleAssignedOptionsClick,
    handleConfirmUnassign,
  } = handlers;

  const [payload, setPayload] = useState();

  // --- WebSocket listener ---
  useEffect(() => {
    const { cleanup } = messageHandler((type, payload) => {
      setPayload(payload);
    });
    return cleanup;
  }, []);

  // --- Search handling ---
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);
  const lowerQ = debouncedQuery.toLowerCase();

  const filteredSubparams = useMemo(() => {
    if (!lowerQ) return subParamsData;
    return subParamsData.filter(({ sub_parameter }) =>
      sub_parameter.toLowerCase().includes(lowerQ)
    );
  }, [subParamsData, lowerQ]);

  // --- Breadcrumbs ---
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
      onClick: () => navigate(PROGRAM_AREAS({ accredInfoUUID, level, programUUID })),
    },
    {
      label: parameter,
      onClick: () =>
        navigate(AREA_PARAMETERS({ accredInfoUUID, level, programUUID, areaUUID })),
    },
    {
      label: 'Sub-Parameters',
      isActive: true,
    },
  ];

  return (
    <DeanLayout>
      <div className="flex-1 bg-slate-50">
        {/* ===== Sticky Header ===== */}
        <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <Breadcrumb items={breadcrumbItems} />

            <div className="relative flex w-full items-center gap-2 md:w-[30rem]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sub-parameter..."
                className="w-full rounded-full border border-slate-300 bg-white px-10 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-400"
              />
              <button
                onClick={handleAddSubparamClick}
                className="inline-flex min-w-32 cursor-pointer items-center justify-center gap-1 rounded-full bg-emerald-600 px-4 py-2 text-white shadow-sm ring-1 ring-emerald-300 transition hover:bg-emerald-500 active:scale-95"
              >
                <FolderPlus className="h-5 w-5" />
                <span className="text-sm font-medium">Add New</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== Program Header ===== */}
        <div className="mx-auto mt-6 flex w-[85%] items-center justify-center md:mt-8 md:w-[75%] lg:w-[50%]">
          <p className="relative mb-8 text-center">
            <span className="text-lg font-bold tracking-wide text-emerald-800 md:text-2xl lg:text-2xl">
              {program}
            </span>
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-full bg-emerald-700 px-4 py-1 text-sm font-bold text-white md:text-sm">
              {levelName} • {formatAreaName(area)} • Param {formatParameterName(parameter)}
            </span>
          </p>
        </div>

        {/* ===== Sub-Parameters Grid ===== */}
        <div className="mx-auto mb-10 max-w-7xl px-4">
          <div
            className={`flex flex-wrap justify-center gap-6 rounded py-4 ${
              filteredSubparams.length ? 'items-start' : 'items-center'
            }`}
          >
            {!filteredSubparams.length && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <FolderOpen className="h-24 w-24 text-slate-400" />
                <p className="mt-4 text-base font-medium text-slate-700">
                  {subParamsData.length === 0
                    ? `No sub-parameters yet. Click “Add New” to create one.`
                    : `No sub-parameters found for “${searchQuery}”.`}
                </p>
              </div>
            )}

            {filteredSubparams.map((data) => {
              const docsArray = documentsBySubParam[data.sub_parameter_id] ?? [];
              const isExpanded = expandedId === data.sub_parameter_id;

              const commonData = {
                accredInfoId: data.accredInfoId,
                levelId: data.levelId,
                programId: data.programId,
                areaId: data.areaId,
                parameterId: data.parameterId,
                subParameterId: data.sub_parameter_id,
              };

              return (
                <div
                  key={data.sub_parameter_uuid}
                  className="mb-4 w-full max-w-[380px] relative"
                >
                  <SubParamCard
                    refs={{ subParamOptionRef }}
                    activeSubParamId={activeSubParamId}
                    commonData={commonData}
                    subParam={{
                      pspmId: data.pspmId,
                      sub_parameter_id: data.sub_parameter_id,
                      sub_parameter_uuid: data.sub_parameter_uuid,
                      sub_parameter: data.sub_parameter,
                    }}
                    docsArray={docsArray}
                    selectedFiles={selectedFiles}
                    isExpanded={isExpanded}
                    taskForce={taskForce}
                    assignmentData={assignmentData}
                    handleSPCardClick={handleSPCardClick}
                    toggleExpand={toggleExpand}
                    handleSaveFile={handleSaveFile}
                    removeSelectedFile={removeSelectedFile}
                    handleUploadClick={handleUploadClick}
                    handleFileUserClick={handleFileUserClick}
                    handleSubParamOption={handleSubParamOption}
                    handleSubParamOptionItem={handleSubParamOptionItem}
                    handleProfileStackClick={handleProfileStackClick}
                  />

                  {/* Document Dropdown */}
                  {isExpanded && docsArray.length > 0 && (
                    <DocumentDropdown
                      docsArray={docsArray}
                      loadingDocs={loadingDocs}
                      errorDocs={errorDocs}
                      selectedFiles={selectedFiles}
                      selectedFileKey={data.sub_parameter_id}
                      removeSelectedFile={removeSelectedFile}
                      renameObj={{
                        isRename,
                        renameInput,
                        renameDocId,
                        renameFileRef,
                        handleRenameClick,
                        handleRenameInputChange,
                        handleKeyDown,
                      }}
                      activeDocId={activeDocId}
                      fileOptionRef={fileOptionRef}
                      loadingFileId={loadingFileId}
                      handleUploadClick={handleUploadClick}
                      handleRemoveClick={handleRemoveClick}
                      handleFileClick={handleFileClick}
                      handleFileOptionClick={handleFileOptionClick}
                      handleSaveFile={handleSaveFile}
                    />
                  )}

                  <input
                    id={`file-input-${data.sub_parameter_id}`}
                    type="file"
                    onChange={(e) => handleFileChange(e, data.sub_parameter_id)}
                    accept="application/pdf,image/*"
                    className="hidden"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== Modal ===== */}
      <SubParamModal
        modalType={modalType}
        refs={{ subParamInputRef }}
        datas={{
          subParamsArr,
          subParamsByParamIdData,
          subParameterInput,
          duplicateValues,
          modalData,
          taskForce,
          taskForceLoading,
          taskForceError,
          taskForceRefetch,
          selectedTaskForce,
          activeTaskForceId,
          showConfirmUnassign,
          assignedTaskForceRef,
        }}
        handlers={{
          handleCloseModal,
          handleSaveSubParams,
          handleAddSubParamValue,
          handleRemoveSubParamValue,
          handleSubParamChange,
          handleConfirmRemove,
          handleDeleteSubParam,
          handleCheckboxChange,
          handleSelectAll,
          handleAssignTaskForce,
          handleAddTaskForceClick,
          handleATFEllipsisClick,
          handleUnassignedAllClick,
          handleAssignedOptionsClick,
          handleConfirmUnassign,
        }}
      />

      {previewFile && (
        <PDFViewer file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </DeanLayout>
  );
};

export default ParamSubparam;
