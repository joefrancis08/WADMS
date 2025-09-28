import React from 'react';
import { ChevronRight, File } from 'lucide-react';

const SubParamCard = ({
  subParam,             // object: { sub_parameter_uuid, sub_parameter, sub_parameter_id }
  docsArray = [],       // documents array for this subparam
  selectedFiles = null,  // selected file for upload
  isExpanded = false,   // whether the dropdown is expanded
  handleSPCardClick,    // click handler for empty docs
  toggleExpand,         // toggle expand handler
  handleSaveFile,       // save selected file
  removeSelectedFile,   // remove selected file
  handleUploadClick     // upload file click
}) => {
  const { sub_parameter_uuid, sub_parameter, sub_parameter_id } = subParam;

  return (
    <div
      onClick={() => {
        if (docsArray.length === 0) {
          handleSPCardClick({ subParameterUUID: sub_parameter_uuid });
        } else {
          toggleExpand(sub_parameter_id);
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
              e.stopPropagation();
              toggleExpand(sub_parameter_id);
            }}
            className='ml-2 hover:bg-slate-200 p-2 rounded-full'
          >
            <ChevronRight
              className={`h-6 w-6 transition-all duration-100 ${isExpanded ? 'rotate-90' : ''}`}
            />
          </button>
        </div>
      ) : (
        <div className='flex flex-col items-start justify-center mt-2'>
          {selectedFiles?.[sub_parameter_id] ? (
            <div className='relative flex justify-between items-baseline border-b border-slate-400 w-full'>
              <p className='flex items-center gap-2 text-sm text-center mt-4 max-w-[150px] lg:max-w-[300px] mb-2'>
                <File className='h-5 w-5 flex-shrink-0' />
                <span
                  title={selectedFiles?.[sub_parameter_id]?.name}
                  className='truncate overflow-hidden whitespace-nowrap'
                >
                  {selectedFiles?.[sub_parameter_id]?.name}
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
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
};

export default SubParamCard;
