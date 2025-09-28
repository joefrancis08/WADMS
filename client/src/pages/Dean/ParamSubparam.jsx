import { useState } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { ChevronRight, FileStack, Plus, Ellipsis, LoaderCircle, Upload, X, Check, FileText, FilePenLine, Trash2 } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import formatParameterName from '../../utils/formatParameterName';
import useParamSubparam from '../../hooks/Dean/useParamSubparam';
import PATH from '../../constants/path';
import SubParamModal from '../../components/Dean/Accreditation/SubParameter/SubParamModal';
import PDFViewer from '../../components/PDFViewer';
import SubParamCard from '../../components/Dean/Accreditation/SubParameter/SubParamCard';
import DocumentList from '../../components/Document/DocumentList';
import DocumentDropdown from '../../components/Document/DocumentDropdown';

const { PROGRAMS_TO_BE_ACCREDITED, AREA_PARAMETERS, PROGRAM_AREAS } = PATH.DEAN;

const ParamSubparam = () => {
  const { navigate, modalType, modalData, refs, params, datas, states, handlers } = useParamSubparam();
  const { subParamInputRef, fileOptionRef, renameFileRef } = refs;
  const { accredInfoUUID, level, programUUID, areaUUID } = params;
  const { previewFile, setPreviewFile, activeDocId, renameInput, renameDocId, loadingFileId } = states;

  const {
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
    isRename
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
    handleConfirmRemove
  } = handlers;

  return (
    <DeanLayout>
      <div className='flex-1'>
        {/* Page header */}
        <ContentHeader 
          headerIcon={FileStack}
          headerTitle='Sub-Parameters'
          searchTitle='Search sub-parameter'
          placeholder='Search sub-parameter...'
          condition={false}
        />

        {/* Breadcrumb navigation */}
        <div className='flex justify-between px-4 pt-4'>
          <p className='flex flex-row items-center gap-1'>
            <span 
              title='Back to Programs'
              onClick={() => navigate(PROGRAMS_TO_BE_ACCREDITED)}
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              Programs
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Areas'
              onClick={() => navigate(PROGRAM_AREAS({ accredInfoUUID, level, programUUID }))} 
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              Areas
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span
              title='Back to Parameters'
              onClick={() => navigate(AREA_PARAMETERS({ accredInfoUUID, level, programUUID, areaUUID }))} 
              className='hover:underline opacity-80 hover:opacity-100 cursor-pointer transition-all'
            >
              Parameters
            </span>
            <ChevronRight className='h-5 w-5'/>
            <span className='font-semibold'>
              {subParamsData.length > 1 ? 'Sub-Parameters' : 'Sub-Parameter'}
            </span>
          </p>
        </div>

        {/* Add button */}
        <div className='flex justify-end px-5 py-3'>
          <button 
            onClick={handleAddSubparamClick} 
            title='Add Sub-Parameters' 
            className='cursor-pointer hover:opacity-80 active:opacity-50'
          >
            <Plus className='h-8 w-8' />
          </button>
        </div>

        {/* Sub-parameters list */}
        <div className={`flex max-md:flex-col flex-wrap gap-y-2 p-2 mb-8 ${subParamsData.length === 0 ? 'justify-center' : 'justify-evenly'}`}>
          {subParamsData.length === 0 && (
            <p>No sub-parameters to display for Parameter {formatParameterName(parameter)}.</p>
          )}

          {subParamsData.map(({ sub_parameter_uuid, sub_parameter, sub_parameter_id }) => {
            const docsArray = documentsBySubParam[sub_parameter_id] ?? []
            const isExpanded = expandedId === sub_parameter_id

            return (
              // Wrapper must be relative to scope the dropdown
              <div key={sub_parameter_uuid} className='mb-4 w-full md:w-[45%] relative'>
                {/* Sub-Parameter Card */}
                <SubParamCard 
                  subParam={{
                    sub_parameter_id,
                    sub_parameter_uuid, 
                    sub_parameter, 
                  }}
                  docsArray={docsArray}
                  selectedFiles={selectedFiles}
                  isExpanded={isExpanded}
                  handleSPCardClick={handleSPCardClick}
                  toggleExpand={toggleExpand}
                  handleSaveFile={handleSaveFile}
                  removeSelectedFile={removeSelectedFile}
                  handleUploadClick={handleUploadClick}
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
        </div>
      </div>

      {/* Sub-parameter modal for adding/editing */}
      <SubParamModal 
        modalType={modalType}
        refs={{ subParamInputRef }}
        datas={{ subParamsArr, subParameterInput, duplicateValues, modalData }}
        handlers={{
          handleCloseModal,
          handleSaveSubParams,
          handleAddSubParamValue,
          handleRemoveSubParamValue,
          handleSubParamChange,
          handleConfirmRemove
        }}
      />
      {previewFile && (
        <PDFViewer file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </DeanLayout>
  );
};

export default ParamSubparam;
