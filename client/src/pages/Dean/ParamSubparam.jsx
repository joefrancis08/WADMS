import { useState, useMemo } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import {
  ChevronRight,
  FolderOpen,
  Plus,
  CirclePlus,
  Search,
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
import { useEffect } from 'react';

const { PROGRAMS_TO_BE_ACCREDITED, AREA_PARAMETERS, PROGRAM_AREAS } = PATH.DEAN;

const ParamSubparam = () => {
  const { navigate, modalType, modalData, refs, params, datas, states, handlers } = useParamSubparam();
  const { accredInfoUUID, level, programUUID, areaUUID } = params;
  const { previewFile, setPreviewFile, activeDocId, renameInput, renameDocId, loadingFileId } = states;
  console.log(previewFile);
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
  } = datas;

  console.log(documentsBySubParam);

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

  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);
  const lowerQ = debouncedQuery.toLowerCase();

  useEffect(() => {
    // Listen for all WebSocket updates
    const { cleanup } = messageHandler((type, payload) => {
      console.log('📡 WebSocket Update:', type, payload);
      setPayload(payload);
    });

    // Cleanup on unmount to avoid memory leaks
    return cleanup;
  }, []);

  console.log(payload);

  // Filter subparameters by query
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
      label: parameter,
      onClick: () => navigate(AREA_PARAMETERS({ accredInfoUUID, level, programUUID, areaUUID })),
    },
    {
      label: subParamsData.length > 1 ? 'Sub-Parameters' : 'Sub-Parameter',
      isActive: true,
    },
  ];

  return (
    <DeanLayout>
      <div className='flex-1 p-3'>
        <div className='bg-slate-900 m-2 pb-2 border border-slate-700 rounded-lg'>
          {/* Header: Breadcrumb + Search (aligned opposite) */}
          <div className='flex flex-col md:flex-row md:items-center md:justify-between shadow px-4 pt-4 bg-black/40 p-4 rounded-t-lg gap-4'>
            {/* Breadcrumbs (left) */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Search (right on desktop, below on mobile) */}
            <div className='relative w-full md:w-1/3 lg:w-1/4'>
              <Search className='absolute left-3 top-2.5 h-5 w-5 text-slate-400' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search sub-parameter...'
                className='pl-10 pr-3 py-2 rounded-full bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-full transition-all'
              />
            </div>
          </div>


          {/* Program + level display */}
          <div className='flex items-center justify-center mt-4 max-md:mt-10 w-auto mx-auto mb-8'>
            <p className='relative text-center gap-2 w-full'>
              <span className='text-yellow-400 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide'>
                {program}
              </span>
              <span className='absolute -bottom-10 right-1/2 translate-x-1/2 text-xs md:text-lg px-6 bg-green-700 text-white font-medium'>
                {levelName} &#8226; {formatAreaName(area)} &#8226; Parameter{' '}
                {formatParameterName(parameter)}
              </span>
            </p>
          </div>

          {/* Subparameters list */}
          <div
            className={`flex flex-wrap gap-8 justify-center mb-8 py-8 px-2 mx-2 rounded ${
              filteredSubparams.length ? 'items-start' : 'items-center'
            }`}
          >
            {/* Empty state */}
            {filteredSubparams.length === 0 && (
              <div className='flex flex-col items-center justify-center'>
                <FolderOpen className='text-slate-600' size={160} />
                <p className='text-lg font-medium text-slate-300 mt-2'>
                  {subParamsData.length === 0
                    ? `No sub-parameters to display for Parameter ${formatParameterName(parameter)}.`
                    : `No sub-parameters found for “${searchQuery}”.`}
                </p>
                {/* Add Subparameter Button */}
                <div className='max-md:hidden flex justify-end px-5 p-2 mt-3'>
                  <button
                    onClick={handleAddSubparamClick}
                    className='flex gap-x-1 text-white text-sm lg:text-base justify-center items-center cursor-pointer rounded-full px-5 py-2 hover:opacity-90 active:scale-98 border-3 border-slate-500 bg-slate-700/50 shadow hover:shadow-md hover:border-green-600 transition'
                  >
                    <Plus className='h-6 w-6' />
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Cards */}
            {filteredSubparams.map(({ pspmId, sub_parameter_uuid, sub_parameter, sub_parameter_id }) => {
              const docsArray = documentsBySubParam[sub_parameter_id] ?? [];
              const isExpanded = expandedId === sub_parameter_id;

              return (
                <div key={sub_parameter_uuid} className='mb-4 w-full md:w-[45%] relative'>
                  <SubParamCard
                    refs={{ subParamOptionRef }}
                    activeSubParamId={activeSubParamId}
                    subParam={{
                      pspmId,
                      sub_parameter_id,
                      sub_parameter_uuid,
                      sub_parameter,
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

                  {/* Dropdown */}
                  {isExpanded && docsArray.length > 0 && (
                    <DocumentDropdown
                      docsArray={docsArray}
                      loadingDocs={loadingDocs}
                      errorDocs={errorDocs}
                      selectedFiles={selectedFiles}
                      selectedFileKey={sub_parameter_id}
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
                    id={`file-input-${sub_parameter_id}`}
                    type='file'
                    onChange={(e) => handleFileChange(e, sub_parameter_id)}
                    accept='application/pdf,image/*'
                    className='hidden'
                  />
                </div>
              );
            })}

            {/* Add Sub-parameter button */}
            {filteredSubparams.length > 0 && (
              <div
                onClick={handleAddSubparamClick}
                className='flex flex-col gap-y-2 items-center justify-center border border-slate-700 hover:scale-102 hover:shadow shadow-slate-600 p-4 rounded-md transition cursor-pointer bg-slate-800 active:opacity-90 w-[45%] py-12 text-slate-100 active:scale-98'
              >
                <CirclePlus className='h-12 w-12 flex shrink-0' />
                <p>Add Sub-parameter</p>
              </div>
            )}
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
