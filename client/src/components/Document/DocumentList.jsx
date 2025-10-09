import { Ellipsis, FilePenLine, FileText, LoaderCircle, Trash2 } from 'lucide-react';
import React from 'react';

const DocumentList = ({
  docObj,
  isRename,
  renameInput,
  renameDocId,
  renameFileRef,
  activeDocId,
  fileOptionRef,
  loadingFileId,
  handleRenameClick,
  handleRenameInputChange,
  handleRemoveClick,
  handleKeyDown,
  handleFileClick,
  handleFileOptionClick
}) => {
  return (
    <div
      key={docObj?.doc_uuid || docObj?.file_name}
      className='relative flex items-center justify-between border-b border-slate-400 py-2 transition m-2'
    >
      <div ref={renameFileRef} className='flex items-center gap-2'>
        {loadingFileId === docObj?.doc_id ? (
            <LoaderCircle 
              className='animate-spin h-5 w-5 text-gray-500' 
            />
          ) : <FileText className='h-5 w-5' />
        }
        {isRename && renameDocId === docObj?.doc_id ? (
          <div className='relative flex items-center'>
            <input 
              autoFocus
              type='text' 
              name='file-name' 
              value={renameInput}
              readOnly={loadingFileId === docObj.doc_id}
              onChange={(e) => handleRenameInputChange(e)}
              onKeyDown={(e) => handleKeyDown(e, docObj)}
              className='text-sm outline-none w-auto truncate max-w-[300px] lg:max-w-[400px]'
            />
          </div>
        ) : (
          <p
            onClick={() => handleFileClick(docObj.file_path)}
            className='text-sm truncate max-w-[300px] text-blue-600 cursor-pointer hover:underline'
            title={docObj?.file_name}
          >
            {docObj.file_name}
          </p>
        ) }
      </div>

      {/* Button for option in the docs */}
      {activeDocId === docObj.doc_uuid && (
        <div ref={fileOptionRef} className='flex flex-col absolute top-2 right-10 bg-slate-800 gap-1 p-2 rounded z-20'>
          <button
            title='Rename'
            className='flex gap-x-2 p-2 text-sm text-white/80 hover:bg-slate-700 rounded-md cursor-pointer'
            onClick={(e) => handleRenameClick(e, docObj)}
          >
            <FilePenLine className='h-5 w-5 text-white/80'/>
            Rename
          </button>
          <hr className='text-slate-600'></hr>
          <button
            title='Remove'
            className='flex gap-x-2 p-2 text-sm bg-transparent text-red-300 hover:bg-red-200/20 rounded-md cursor-pointer'
            onClick={(e) => handleRemoveClick(e, {
              docId: docObj.doc_id,
              document: docObj.file_name
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
          handleFileOptionClick(docObj.doc_uuid);
        }}
      >
        <Ellipsis className='h-5 w-5 text-gray-600 cursor-pointer' />
      </button>
    </div>
  );
};

export default DocumentList;
