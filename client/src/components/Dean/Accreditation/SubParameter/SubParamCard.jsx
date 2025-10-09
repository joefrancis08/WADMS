import React from 'react';
import { ChevronRight, EllipsisVertical, File, FileSpreadsheet, FileText, FileUser } from 'lucide-react';
import ProfileStack from '../../../ProfileStack';
import Dropdown from '../../../Dropdown/Dropdown';
import { MENU_OPTIONS } from '../../../../constants/user';
import deduplicateAssignments from '../../../../utils/deduplicateAssignments';

const SubParamCard = ({
  refs,
  subParam,             // object: { sub_parameter_uuid, sub_parameter, sub_parameter_id }
  activeSubParamId,     // activeId of subparameter
  docsArray = [],       // documents array for this subparam
  selectedFiles = null,  // selected file for upload
  isExpanded = false,   // whether the dropdown is expanded
  assignmentData,
  taskForce,
  handleSPCardClick,    // click handler for empty docs
  toggleExpand,         // toggle expand handler
  handleSaveFile,       // save selected file
  removeSelectedFile,   // remove selected file
  handleUploadClick,     // upload file click
  handleFileUserClick,
  handleSubParamOption,
  handleSubParamOptionItem,
  handleProfileStackClick

}) => {
  const { subParamOptionRef } = refs;
  const { pspmId, sub_parameter_uuid, sub_parameter, sub_parameter_id } = subParam;

  console.log(pspmId);

  return (
    <div
      onClick={() => {
        if (docsArray.length === 0) {
          handleSPCardClick({ subParameterUUID: sub_parameter_uuid });
        } else {
          toggleExpand(sub_parameter_id);
        }
      }}
      className='flex flex-col border border-slate-700 hover:shadow shadow-slate-600 p-4 rounded-md transition cursor-pointer bg-slate-800 h-auto'
    >
      <div className='relative flex items-center justify-between mb-3'>
        {/* Sub-Parameter Title */}
        <p className='font-medium text-slate-100 text-lg'>
          {sub_parameter}
        </p>
        <button 
          onClick={(e) => handleSubParamOption(e, sub_parameter_uuid)}
          className={`text-slate-100 cursor-pointer p-2 hover:bg-slate-700 rounded-full active:scale-98 ${activeSubParamId === sub_parameter_uuid && 'bg-slate-700'}`}
        >
          <EllipsisVertical className='h-5 w-5'/>
        </button>
        {console.log(activeSubParamId)}
        {activeSubParamId === sub_parameter_uuid && (
          <>
            <div className='absolute inset-0 z-20'></div>
            <div ref={subParamOptionRef} className='absolute top-0 right-5/11 flex items-center shadow-md z-40'>
              <Dropdown 
                width={'w-50'} 
                border={'border border-slate-300 rounded-lg bg-slate-800'}
              >
                {MENU_OPTIONS.DEAN.SUB_PARAMETER_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <React.Fragment key={item.id}>
                      {item.label === 'Delete' && (
                        <hr className='my-1 mx-auto w-[90%] text-slate-300'></hr>
                      )}
                      <p 
                        onClick={(e) => handleSubParamOptionItem(e, {
                          label: item.label,
                          pspmId,
                          subParamId: sub_parameter_id,
                          subParamUUID: sub_parameter_uuid,
                          subParameter: sub_parameter
                        })}
                        className={`flex items-center p-2 rounded-md text-sm active:scale-99 transition
                          ${item.label === 'Delete' 
                            ? 'hover:bg-red-200 text-red-600' 
                            : 'hover:bg-slate-200'}`}
                      >
                        <Icon />
                        <span className='ml-2'>
                          {item.label}
                        </span>
                      </p>
                    </React.Fragment>
                  );
                })}
              </Dropdown>
            </div>
          </>
        )}
      </div>

      {/* Document count + chevron */}
      {docsArray.length ? (
        <div className='flex justify-between items-center mt-1 text-sm text-slate-100 hover:bg-slate-700 rounded'>
          <p className='flex items-center gap-x-2 hover:bg-slate-700 rounded p-1'>
            <FileText className='h-5 w-5'/>
            {docsArray.length} {docsArray.length === 1 ? 'document' : 'documents'}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(sub_parameter_id);
            }}
            className='ml-2 p-2 rounded-full cursor-pointer'
          >
            <ChevronRight
              className={`h-5 w-5 transition-all duration-100 ${isExpanded ? 'rotate-90' : ''}`}
            />
          </button>
        </div>
      ) : (
        <div className='flex flex-col items-start justify-center mt-2'>
          {selectedFiles?.[sub_parameter_id] ? (
            <div className='relative flex justify-between items-center mb-2 border-b border-slate-600 w-full'>
              <p className='flex items-center gap-2 text-sm text-center mt-2 max-w-[150px] lg:max-w-[300px] mb-2 text-slate-100'>
                <File className='h-5 w-5 flex-shrink-0' />
                <span
                  title={selectedFiles?.[sub_parameter_id]?.name}
                  className='truncate'
                >
                  {selectedFiles?.[sub_parameter_id]?.name}
                </span>
              </p>
              <div>
                <p className='text-sm text-slate-100'>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveFile(sub_parameter_id);
                    }}
                    className='hover:bg-slate-700 px-3 py-1 rounded-full transition-all'
                  >
                    Confirm
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedFile(sub_parameter_id);
                    }}
                    className='hover:bg-slate-200 px-3 py-1 rounded-full text-red-400 transition-all'
                  >
                    Remove
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className='text-sm mt-2 text-slate-100'>
              No uploaded document.{'\n'}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadClick(sub_parameter_id);
                }}
                className='hover:underline text-blue-400'
              >
                Upload
              </span>
            </p>
          )}
        </div>
      )}
      <hr className='text-slate-700 my-2'></hr>
      <div className='flex items-center justify-between px-1'>
        <div className='-ml-2'>
          <ProfileStack 
            data={{ 
              assignmentData: deduplicateAssignments(assignmentData, 'subParameter'), 
              taskForce, 
              subParameterId: sub_parameter_id }}
            handlers={{ handleProfileStackClick }}
            scope='subParameter'
          />
        </div>
        <button
          title='Assign Task Force' 
          onClick={(e) => handleFileUserClick(e, {
            subParamId: sub_parameter_id,
            subParamUUID: sub_parameter_uuid,
            subParameter: sub_parameter
          })}
          className='-mr-2 p-2 rounded-full hover:bg-slate-700 text-slate-100 active:scale-98 cursor-pointer'>
          <FileUser />
        </button>
      </div>
    </div>
  );
};

export default SubParamCard;
