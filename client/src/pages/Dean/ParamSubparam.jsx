import { useState } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { ChevronRight, FileStack, Plus, Ellipsis, LoaderCircle, Upload, X, Check, FileText, FilePenLine, Trash2, FolderOpen, CirclePlus } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import formatParameterName from '../../utils/formatParameterName';
import useParamSubparam from '../../hooks/Dean/useParamSubparam';
import PATH from '../../constants/path';
import SubParamModal from '../../components/Dean/Accreditation/SubParameter/SubParamModal';
import PDFViewer from '../../components/PDFViewer';
import SubParamCard from '../../components/Dean/Accreditation/SubParameter/SubParamCard';
import DocumentList from '../../components/Document/DocumentList';
import DocumentDropdown from '../../components/Document/DocumentDropdown';
import formatAreaName from '../../utils/formatAreaName';

const { PROGRAMS_TO_BE_ACCREDITED, AREA_PARAMETERS, PROGRAM_AREAS } = PATH.DEAN;

const ParamSubparam = () => {
  const { navigate, modalType, modalData, refs, params, datas, states, handlers } = useParamSubparam();
  const { accredInfoUUID, level, programUUID, areaUUID } = params;
  const { previewFile, setPreviewFile, activeDocId, renameInput, renameDocId, loadingFileId } = states;
  const { 
    navEllipsisRef, subParamInputRef, fileOptionRef, 
    renameFileRef, subParamOptionRef, assignedTaskForceRef 
  } = refs;

  const {
    title,
    year,
    area,
    program,
    levelName,
    subParamsData,
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
    isNavEllipsisClick,
    activeSubParamId,
    taskForce,
    taskForceLoading,
    taskForceError,
    taskForceRefetch,
    selectedTaskForce,
    assignmentData,
    activeTaskForceId,
    showConfirmUnassign
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
    handleNavEllipsis,
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
    handleConfirmUnassign
  } = handlers;

  return (
    <DeanLayout>
      <div className='flex-1 p-3'>
        {/* Breadcrumb navigation */}
        <div className='bg-slate-900 m-2 pb-2 border border-slate-700 rounded-lg'>
          <div className='flex justify-between shadow px-4 pt-4 bg-black/40 p-4 rounded-t-lg'>
            <div 
              onClick={() => {
                localStorage.removeItem('modal-type');
                localStorage.removeItem('modal-data');
              }}  
              className='relative flex flex-row items-center text-slate-100 text-sm gap-1'>
              <span
                onClick={() => {
                  localStorage.removeItem('lastProgramId');
                  localStorage.setItem('accreditation-title', `${title} ${year}`);
                  navigate(PROGRAMS_TO_BE_ACCREDITED);
                }}
                className='hover:underline cursor-pointer transition-all'
              >
                {`${title} ${year}`}
              </span>
              <ChevronRight className='h-5 w-5'/>
              <p ref={navEllipsisRef}>
                <span onClick={handleNavEllipsis} className=' rounded-full text-slate-100 cursor-pointer'>
                  <Ellipsis className='h-4 w-4 -mb-2 hover:bg-slate-700 rounded-lg'/>
                </span>
                {isNavEllipsisClick && (
                  <div className='absolute right-1/2 translate-1/2 -bottom-1/2'>
                    <p className='flex flex-col bg-slate-700 px-2 py-2 rounded-lg transition-all -mb-5'>
                      <span 
                        title='Back to Programs'
                        onClick={() => {
                          localStorage.removeItem('accreditation-title');
                          navigate(PROGRAMS_TO_BE_ACCREDITED);
                        }}
                        className='hover:underline active:scale-99 cursor-pointer '
                      >
                        {program}
                      </span>
                      <span 
                        title='Back to Areas'
                        onClick={() => {
                          localStorage.removeItem('modal-type');
                          localStorage.removeItem('modal-data');
                          navigate(PROGRAM_AREAS({ accredInfoUUID, level, programUUID }));
                        }}
                        className='hover:underline active:scale-99 cursor-pointer '
                      >
                        {formatAreaName(area)}
                      </span>
                    </p>
                  </div>
                )}
              </p>
              <ChevronRight className='h-4 w-4 text-slate-100'/>
              <span
                title={parameter}
                onClick={() => navigate(AREA_PARAMETERS({ accredInfoUUID, level, programUUID, areaUUID }))} 
                className='hover:underline w-10 truncate cursor-pointer transition-all'
              >
                {parameter}
              </span>
              <ChevronRight className='h-5 w-5'/>
              <span className='font-semibold text-lg'>
                {subParamsData.length > 1 ? 'Sub-Parameters' : 'Sub-Parameter'}
              </span>
            </div>
          </div>
          {/* Program and Level Display */}
          <div className='flex items-center justify-center mt-4 max-md:mt-10 w-auto mx-auto'>
            <p className='relative text-center gap-2 w-full'>
              <span className='text-yellow-400 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide'>
                {program}
              </span>
              <span className='absolute -bottom-10 right-1/2 translate-x-1/2 text-xs md:text-lg px-4 bg-green-700 text-white font-medium rounded-md'>
                {levelName} &#8226; {formatAreaName(area)} &#8226; Parameter {formatParameterName(parameter)}
              </span>
            </p>
          </div>
          <hr className='my-6 w-[50%] mx-auto border text-green-500' />

          {/* Sub-parameters list */}
          <div className={`flex flex-wrap gap-8 justify-center mb-8 py-8 px-2 mx-2 rounded ${subParamsData.length ? 'items-start' : 'items-center'}`}>
            {subParamsData.length === 0 && (
              <div className='flex flex-col items-center justify-center'>
                <FolderOpen className='text-slate-600' size={200}/>
                <p className='text-lg font-medium text-slate-200'>
                  No sub-parameters to display for Parameter {formatParameterName(parameter)}.
                </p>
                {/* Add Parameter Button */}
                <div className='max-md:hidden flex justify-end px-5 p-2'>
                  <button
                    onClick={handleAddSubparamClick}
                    className='flex gap-x-1 text-white text-sm lg:text-base justify-center items-center cursor-pointer rounded-full px-4 py-2 hover:opacity-90 active:opacity-80 bg-green-600 shadow hover:shadow-md'
                  >
                    <Plus className='h-5 w-5' />
                    Add
                  </button>
                </div>
              </div>
            )}
            {console.log(subParamsData)}
            {subParamsData.map(({ pspmId, sub_parameter_uuid, sub_parameter, sub_parameter_id }) => {
              const docsArray = documentsBySubParam[sub_parameter_id] ?? []
              const isExpanded = expandedId === sub_parameter_id

              return (
                // Wrapper must be relative to scope the dropdown
                <div key={sub_parameter_uuid} className='mb-4 w-full md:w-[45%] relative'>
                  {/* Sub-Parameter Card */}
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
                  
                  {/* Dropdown section aligned with card */}
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
                  {/* Hidden input per subparam */}
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
            {subParamsData.length > 0 && (
              <div
                onClick={handleAddSubparamClick}
                className='flex flex-col gap-y-2 items-center justify-center border border-slate-700 hover:scale-102 hover:shadow shadow-slate-600 p-4 rounded-md transition cursor-pointer bg-slate-800 active:opacity-90 w-[45%] py-12 text-slate-100 active:scale-98'
              >
                <CirclePlus className='h-12 w-12 flex shrink-0'/>
                <p>Add Sub-parameter</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-parameter modal for adding/editing */}
      <SubParamModal 
        modalType={modalType}
        refs={{ subParamInputRef }}
        datas={{ 
          subParamsArr, 
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
          assignedTaskForceRef
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
          handleConfirmUnassign
        }}
      />
      {previewFile && (
        <PDFViewer file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </DeanLayout>
  );
};

export default ParamSubparam;
