import { useState } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { ChevronRight, File, FileStack, Plus, Ellipsis, LoaderCircle, Upload, X, Check, FileUp, FileText, FilePenLine, FileX2, Trash2 } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import formatParameterName from '../../utils/formatParameterName';
import useParamSubparam from '../../hooks/Dean/useParamSubparam';
import PATH from '../../constants/path';
import SubParamModal from '../../components/Dean/SubParamModal';
import AddField from '../../components/Form/AddField';
import PDFViewer from '../../components/PDFViewer';
import Dropdown from '../../components/Dropdown/Dropdown';

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
              // wrapper must be relative to scope the dropdown
              <div key={sub_parameter_uuid} className='mb-4 w-full md:w-[45%] relative'>
                {/* Sub-Parameter Card */}
                <div
                  onClick={() => {
                    if (docsArray.length === 0) {
                      handleSPCardClick({ subParameterUUID: sub_parameter_uuid })
                    } else {
                      toggleExpand(sub_parameter_id)
                    }
                  }}
                  className='flex flex-col border p-4 rounded-md transition-all cursor-pointer hover:bg-slate-50 active:opacity-90'
                >
                  {/* Sub-Parameter Title */}
                  <p className='font-medium'>{sub_parameter}</p>

                  {/* Document count + chevron */}
                  {docsArray.length ? (
                    <div className='flex justify-between items-center mt-1 text-sm text-gray-800'>
                      <p className='hover:bg-slate-200 rounded p-1'>
                        {docsArray.length} {docsArray.length === 1 ? 'document' : 'documents'}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpand(sub_parameter_id)
                        }}
                        className='ml-2 hover:bg-slate-200 p-2 rounded-full'
                      >
                        <ChevronRight 
                          className={`h-6 w-6 transition-all duration-100 ${isExpanded && 'rotate-90'}`}
                        />
                      </button>
                    </div>
                  ) : (
                    <div className='flex flex-col items-start justify-center mt-2'>
                      {selectedFiles[sub_parameter_id] 
                      ? (
                          <div className='relative flex justify-between items-baseline border-b border-slate-400 w-full'>
                            <p className='flex items-center gap-2 text-sm text-center mt-4 max-w-[150px] lg:max-w-[300px] mb-2'>
                              <File className='h-5 w-5 flex-shrink-0'/>
                              <span
                                title={selectedFiles[sub_parameter_id].name} 
                                className='truncate overflow-hidden whitespace-nowrap'
                              >
                                {selectedFiles[sub_parameter_id].name}
                              </span>
                            </p>
                            <p className='absolute top-4 right-0 text-sm'>
                              <span 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveFile(sub_parameter_id);
                                }}
                                className='hover:bg-green-100 hover:text-green-800 px-3 py-1 rounded-full transition-all'
                                >
                                Confirm
                              </span>
                              <span 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSelectedFile(sub_parameter_id);
                                }}
                                className='hover:bg-slate-200 px-3 py-1 rounded-full text-red-500 transition-all'
                                >
                                Remove
                              </span>
                            </p>
                          </div>
                        ) 
                      : (
                          <p className='text-sm mt-4'>
                            No uploaded document.{'\n'}
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUploadClick(sub_parameter_id);
                              }}
                              className='hover:underline text-blue-500'
                            >
                              Upload
                            </span>
                          </p>
                        )
                      }
                    </div>
                  )}
                </div>

                {/* Dropdown section aligned with card */}
                {isExpanded && docsArray.length > 0 && (
                  <div className='absolute left-0 right-0 mt-1 bg-gray-50 border border-slate-200 rounded-md px-4 py-8 shadow-lg z-10'>
                    <p className='px-2 text-lg font-medium text-slate-700 mb-1'>
                      {docsArray.length === 1 ? 'Document' : 'Documents'}
                    </p>
                    {loadingDocs ? (
                      <div className='flex items-center justify-center mt-2'>
                        <LoaderCircle 
                          className='text-slate-500 h-8 w-8 animate-spin'
                        />
                      </div>
                      
                    ) : errorDocs ? (
                      <p className='text-red-500'>Error loading documents</p>
                    ) : docsArray.length === 0 ? (
                      <p className='text-gray-500'>No documents available.</p>
                    ) : (
                      docsArray.map((doc) => (
                        <div
                          key={doc.doc_uuid || doc.file_name}
                          className='relative flex items-center justify-between border-b border-slate-400 py-2 transition m-2'
                        >
                          <div ref={renameFileRef} className='flex items-center gap-2'>
                            {loadingFileId === doc.doc_id ? (
                                <LoaderCircle 
                                  className='animate-spin h-5 w-5 text-gray-500' 
                                />
                              ) : <FileText className='h-5 w-5' />
                            }
                            {isRename && renameDocId === doc.doc_id ? (
                              <div className='relative flex items-center'>
                                <input 
                                  autoFocus
                                  type='text' 
                                  name='file-name' 
                                  value={renameInput}
                                  readOnly={loadingFileId === doc.doc_id}
                                  onChange={(e) => handleRenameInputChange(e)}
                                  onKeyDown={(e) => handleKeyDown(e, doc)}
                                  className='text-sm outline-none w-100 truncate max-w-[300px] lg:max-w-[400px]'
                                />
                              </div>
                            ) : (
                              <p
                                onClick={() => handleFileClick(doc.file_path)}
                                className='text-sm truncate max-w-[300px] text-blue-600 cursor-pointer hover:underline'
                                title={doc.file_name}
                              >
                                {doc.file_name}
                              </p>
                            ) }
                          </div>

                          {/* Button for option in the docs */}
                          {activeDocId === doc.doc_uuid && (
                            <div ref={fileOptionRef} className='flex flex-col absolute top-2 right-10 bg-slate-800 gap-1 p-2 rounded z-20'>
                              <button
                                title='Rename'
                                className='flex gap-x-2 p-2 text-sm text-white/80 hover:bg-slate-300/30 rounded-md cursor-pointer'
                                onClick={(e) => handleRenameClick(e, doc)}
                              >
                                <FilePenLine className='h-5 w-5 text-white/80'/>
                                Rename
                              </button>
                              <hr className='text-slate-600'></hr>
                              <button
                                title='Remove'
                                className='flex gap-x-2 p-2 text-sm bg-transparent text-red-300 hover:bg-red-100/30 rounded-md cursor-pointer'
                                onClick={(e) => handleRemoveClick(e, {
                                  docId: doc.doc_id,
                                  document: doc.file_name
                                })}
                              >
                                <Trash2 className='h-5 w-5 text-red-300'/>
                                Delete
                              </button>
                            </div>
                          )}

                          {/* Options menu */}
                          <button
                            title='Options'
                            className='p-1 rounded-full hover:bg-gray-200 active:bg-gray-300'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileOptionClick(doc.doc_uuid);
                            }}
                          >
                            <Ellipsis className='h-5 w-5 text-gray-600 cursor-pointer' />
                          </button>
                        </div>
                      ))
                    )}
                    {/* Show selected file for this subparam */}
                    {selectedFiles[sub_parameter_id] && (
                      <div className='px-3 mt-5 flex justify-between items-center'>
                        <p className='text-sm text-slate-600 mb-2 truncate'>
                          File: <span className='font-medium'>{selectedFiles[sub_parameter_id].name}</span>
                        </p>
                        <button 
                          title='Remove'
                          onClick={() => removeSelectedFile(sub_parameter_id)}
                          className='text-slate-600 hover:text-red-600 p-1 rounded-full hover:bg-slate-200'
                        >
                          <X className='h-4 w-4'/>
                        </button>
                      </div>
                    )}

                    {selectedFiles[sub_parameter_id] && (
                      <div className='mt-4 px-2'>
                        <button
                          onClick={() => handleSaveFile(sub_parameter_id)}
                          className='w-full flex items-center justify-center gap-2 py-2 px-4 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 active:scale-95 transition cursor-pointer'
                        >
                          <Check className='h-5 w-5' />
                          Confirm
                        </button>
                      </div>
                    )}

                    {/* Upload button */}
                    <div className='mt-4 px-2 flex flex-col items-center'>
                      <button
                        onClick={() => handleUploadClick(sub_parameter_id)}
                        className={`${selectedFiles[sub_parameter_id] 
                          ? 'bg-slate-600 hover:bg-slate-700' 
                          : 'bg-green-600 hover:bg-green-700'} w-full flex items-center justify-center gap-2 py-2 px-4 text-sm text-white rounded-md active:scale-95 transition cursor-pointer`}
                      >
                        {
                          selectedFiles[sub_parameter_id] 
                          ? '' 
                          : <Upload className='h-5 w-5' />
                        }
                        {
                          selectedFiles[sub_parameter_id] 
                          ? 'Change File' 
                          : 'Upload'
                        }
                      </button>
                    </div>
                  </div>
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
