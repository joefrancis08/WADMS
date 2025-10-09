import React from 'react';
import DocumentList from './DocumentList';
import { Check, Upload, X } from 'lucide-react';

const DocumentDropdown = (props) => {
  const {
    docsArray = [],
    loadingDocs,
    errorDocs,
    selectedFiles = {},
    selectedFileKey,
    removeSelectedFile,
    renameObj = {},
    activeDocId,
    fileOptionRef,
    loadingFileId,
    handleUploadClick,
    handleRemoveClick,
    handleFileClick, 
    handleFileOptionClick,
    handleSaveFile
  } = props;

  const {
    isRename,
    renameInput,
    renameDocId,
    renameFileRef,
    handleRenameClick,
    handleRenameInputChange,
    handleKeyDown,
  } = renameObj;

  return (
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
          <DocumentList 
            key={doc.doc_id}
            docObj={doc}
            isRename={isRename}
            renameInput={renameInput}
            renameDocId={renameDocId}
            renameFileRef={renameFileRef}
            activeDocId={activeDocId}
            fileOptionRef={fileOptionRef}
            loadingFileId={loadingFileId}
            handleRenameClick={handleRenameClick}
            handleRenameInputChange={handleRenameInputChange}
            handleRemoveClick={handleRemoveClick}
            handleKeyDown={handleKeyDown}
            handleFileClick={handleFileClick}
            handleFileOptionClick={handleFileOptionClick}
          />
        ))
      )}

      {/* Show selected file for this subparam */}
      {selectedFiles[selectedFileKey] && (
        <div className='px-3 mt-5 flex items-center justify-between'>
          <p className='text-sm text-slate-600 truncate'>
            Filename: <span className='font-medium'>{selectedFiles[selectedFileKey].name}</span>
          </p>
          <button 
            title='Remove'
            onClick={() => removeSelectedFile(selectedFileKey)}
            className='text-slate-600 hover:text-red-600 p-1 rounded-full hover:bg-slate-200'
          >
            <X className='h-4 w-4'/>
          </button>
        </div>
      )}

      {selectedFiles[selectedFileKey] && (
        <div className='mt-4 px-2'>
          <button
            onClick={() => handleSaveFile(selectedFileKey)}
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
          onClick={() => handleUploadClick(selectedFileKey)}
          className={`${selectedFiles[selectedFileKey] 
            ? 'bg-slate-600 hover:bg-slate-700' 
            : 'bg-green-600 hover:bg-green-700'} w-full flex items-center justify-center gap-2 py-2 px-4 text-sm text-white rounded-md active:scale-95 transition cursor-pointer`}
        >
          {
            selectedFiles[selectedFileKey] 
            ? '' 
            : <Upload className='h-5 w-5' />
          }
          {
            selectedFiles[selectedFileKey] 
            ? 'Change File' 
            : 'Upload'
          }
        </button>
      </div>
    </div>
  );
};

export default DocumentDropdown;
