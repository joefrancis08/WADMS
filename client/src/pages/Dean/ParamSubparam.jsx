import { useState, useMemo, useEffect } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import {
  FolderOpen,
  Plus,
  Search,
  FolderPlus,
} from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import formatParameterName from '../../utils/formatParameterName';
import useParamSubparam from '../../hooks/Dean/useParamSubparam';
import PATH from '../../constants/path';
import SubParamModal from '../../components/Dean/Accreditation/SubParameter/SubParamModal';
import PDFViewer from '../../components/PDFViewer';
import SubParamCard from '../../components/Dean/Accreditation/SubParameter/SubParamCard';
import DocumentDropdown from '../../components/Document/DocumentDropdown';
import formatAreaName from '../../utils/formatAreaName';
import Breadcrumb from '../../components/Breadcrumb';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { messageHandler } from '../../services/websocket/messageHandler';

const { PROGRAMS_TO_BE_ACCREDITED, AREA_PARAMETERS, PROGRAM_AREAS } = PATH.DEAN;

const ParamSubparam = () => {
  const { navigate, modalType, modalData, refs, params, datas, states, handlers } = useParamSubparam();
  const { accredInfoUUID, level, programUUID, areaUUID } = params;
  const {
    subParamInputRef, fileOptionRef, renameFileRef, subParamOptionRef, assignedTaskForceRef,
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
    activeDocId,
    loadingFileId,
    previewFile,
    setPreviewFile,
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

  // WebSocket updates (unchanged)
  const [payload, setPayload] = useState();
  useEffect(() => {
    const { cleanup } = messageHandler((type, payload) => {
      // Keep behavior identical, just store latest payload for any side-effects the hook depends on
      setPayload(payload);
    });
    return cleanup;
  }, []);

  // Search (debounced)
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);
  const lowerQ = debouncedQuery.toLowerCase();

  const filteredSubparams = useMemo(() => {
    if (!lowerQ) return subParamsData;
    return subParamsData.filter(({ sub_parameter }) =>
      sub_parameter.toLowerCase().includes(lowerQ)
    );
  }, [subParamsData, lowerQ]);

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
      onClick: () => {
        localStorage.removeItem('accreditation-title');
        navigate(PATH.DEAN.PROGRAMS_TO_BE_ACCREDITED);
      },
    },
    {
      label: formatAreaName(area),
      onClick: () => navigate(PROGRAM_AREAS({ accredInfoUUID, level, programUUID })),
    },
    {
      label: `Parameter ${formatParameterName(parameter)}`,
      onClick: () => navigate(AREA_PARAMETERS({ accredInfoUUID, level, programUUID, areaUUID })),
    },
    {
      label: subParamsData.length > 1 ? 'Sub-Parameters' : 'Sub-Parameter',
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

            <div className="relative flex w-full items-center gap-2 md:w-[30rem]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sub-parameter..."
                className="w-full rounded-full border border-slate-300 bg-white px-9 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-400"
              />
              <button
                title="Add new sub-parameter"
                onClick={handleAddSubparamClick}
                className="inline-flex min-w-28 cursor-pointer items-center justify-center gap-1 rounded-full bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-emerald-300 transition hover:bg-emerald-500 active:scale-95"
              >
                <FolderPlus className="h-4 w-4" />
                <span>Add New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Centered Program header with auto-size pill (matches other pages) */}
        <div className="mx-auto mt-6 flex w-[85%] items-center justify-center md:mt-8 md:w-[75%] lg:w-[80%]">
          <p className="relative mb-8 text-center min-w-0">
            <span className="text-lg font-bold tracking-wide text-emerald-800 md:text-2xl lg:text-2xl">
              {program}
            </span>
            <span
              className="absolute -bottom-7 left-1/2 -translate-x-1/2 inline-flex max-w-[90vw] items-center whitespace-nowrap rounded-full bg-emerald-700 px-4 py-1 text-sm font-bold text-white shadow-sm ring-1 ring-emerald-900/10"
              title={`${levelName} • ${formatAreaName(area)} • Parameter ${formatParameterName(parameter)}`}
            >
              {levelName} &bull; {formatAreaName(area)} &bull; Parameter {formatParameterName(parameter)}
            </span>
          </p>
        </div>

        {/* Sub-parameters list */}
        <div className="mx-auto mb-10 max-w-7xl px-4">
          <div
            className={`mt-2 flex flex-wrap justify-center gap-6 rounded py-2 ${
              filteredSubparams.length ? 'items-start' : 'items-center'
            }`}
          >
            {/* Empty state */}
            {filteredSubparams.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <FolderOpen className="h-20 w-20 text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  {subParamsData.length === 0
                    ? `No sub-parameters to display for Parameter ${formatParameterName(parameter)}.`
                    : `No sub-parameters found for “${searchQuery}”.`}
                </p>
                <div className="mt-3">
                  <button
                    onClick={handleAddSubparamClick}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-800 shadow transition hover:border-emerald-500 hover:bg-slate-50 active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            )}

            {/* Cards */}
            {filteredSubparams.map((data) => {
              const docsArray = documentsBySubParam[data.sub_parameter_id] ?? [];
              const isExpanded = expandedId === data.sub_parameter_id;
              const accredInfoId = data.accredInfoId;
              const levelId = data.levelId;
              const programId = data.programId;
              const areaId = data.areaId;
              const parameterId = data.parameterId;
              const subParameterId = data.sub_parameter_id;

              return (
                <div key={data.sub_parameter_uuid} className="mb-4 w-full md:w-[46%] relative">
                  <SubParamCard
                    refs={{ subParamOptionRef }}
                    activeSubParamId={activeSubParamId}
                    commonData={{
                      accredInfoId,
                      levelId,
                      programId,
                      areaId,
                      parameterId,
                      subParameterId
                    }}
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

                  {/* File actions dropdown (unchanged behavior) */}
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

                  {/* Hidden input for uploads */}
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

      {/* SubParam Modal */}
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
