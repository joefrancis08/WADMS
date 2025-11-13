import React from 'react';
import {
  ChevronRight,
  EllipsisVertical,
  File,
  FileText,
  FileUser,
} from 'lucide-react';
import Dropdown from '../../../Dropdown/Dropdown';
import ProfileStack from '../../../ProfileStack';
import deduplicateAssignments from '../../../../utils/deduplicateAssignments';
import { MENU_OPTIONS } from '../../../../constants/user';

const SubParamCard = ({
  refs,
  commonData,
  subParam,
  activeSubParamId,
  docsArray = [],
  selectedFiles = null,
  isExpanded = false,
  assignmentData,
  taskForce,
  handleSPCardClick,
  toggleExpand,
  handleSaveFile,
  removeSelectedFile,
  handleUploadClick,
  handleFileUserClick,
  handleSubParamOption,
  handleSubParamOptionItem,
  handleProfileStackClick,
}) => {
  const { subParamOptionRef } = refs;
  const { sub_parameter_uuid, sub_parameter, sub_parameter_id, pspmId } = subParam;
  const {
    accredInfoId,
    levelId,
    programId,
    areaId,
    parameterId,
    subParameterId,
  } = commonData;

  return (
    <div
      onClick={() => {
        if (docsArray.length === 0) {
          handleSPCardClick({ subParameterUUID: sub_parameter_uuid });
        } else {
          toggleExpand(sub_parameter_id);
        }
      }}
      className="relative flex flex-col w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md cursor-pointer"
    >
      {/* Header: title + ellipsis */}
      <div className="relative flex items-center justify-between mb-3">
        <p className="truncate text-lg font-semibold text-slate-900">
          {sub_parameter}
        </p>
        <button
          onClick={(e) => handleSubParamOption(e, sub_parameter_uuid)}
          className={`rounded-full border border-slate-200 bg-white p-1.5 text-slate-700 shadow-sm transition hover:bg-slate-50 active:opacity-70 cursor-pointer ${
            activeSubParamId === sub_parameter_uuid ? 'ring-2 ring-emerald-200' : ''
          }`}
        >
          <EllipsisVertical className="h-5 w-5" />
        </button>

        {activeSubParamId === sub_parameter_uuid && (
          <div
            ref={subParamOptionRef}
            className="absolute right-0 top-10 z-[60]"
            onClick={(e) => e.stopPropagation()}
          >
            <Dropdown width="w-56" border="border border-slate-200 rounded-lg bg-white shadow-lg">
              {MENU_OPTIONS.DEAN.SUB_PARAMETER_OPTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <React.Fragment key={item.id}>
                    {item.label === 'Delete' && (
                      <hr className="my-1 mx-auto w-[92%] text-slate-200" />
                    )}
                    <p
                      onClick={(e) =>
                        handleSubParamOptionItem(e, {
                          label: item.label,
                          pspmId,
                          subParamId: sub_parameter_id,
                          subParamUUID: sub_parameter_uuid,
                          subParameter: sub_parameter,
                        })
                      }
                      className={`flex items-center rounded-md px-3 py-2 text-sm transition cursor-pointer ${
                        item.label === 'Delete'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="ml-2">{item.label}</span>
                    </p>
                  </React.Fragment>
                );
              })}
            </Dropdown>
          </div>
        )}
      </div>

      {/* Documents section */}
      {docsArray.length ? (
        <div className="flex justify-between items-center text-sm text-slate-700">
          <p className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {docsArray.length} {docsArray.length === 1 ? 'document' : 'documents'}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(sub_parameter_id);
            }}
            className="p-1.5 rounded-full hover:bg-slate-50 cursor-pointer"
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform duration-150 ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          </button>
        </div>
      ) : (
        <div className="mt-2">
          {selectedFiles?.[sub_parameter_id] ? (
            <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
              <p className="flex items-center gap-2 text-sm text-slate-700 truncate max-w-[200px]">
                <File className="h-5 w-5" />
                {selectedFiles[sub_parameter_id].name}
              </p>
              <div className="flex gap-2">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveFile(sub_parameter_id);
                  }}
                  className="text-emerald-700 hover:underline cursor-pointer"
                >
                  Confirm
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedFile(sub_parameter_id);
                  }}
                  className="text-red-500 hover:underline cursor-pointer"
                >
                  Remove
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-700">
              No uploaded document.{' '}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadClick(sub_parameter_id);
                }}
                className="text-emerald-700 hover:underline cursor-pointer"
              >
                Upload
              </span>
            </p>
          )}
        </div>
      )}

      <hr className="my-3 border-slate-200" />

      {/* Footer: Taskforce / Assign */}
      <div className="flex items-center justify-between">
        <ProfileStack
          data={{
            assignmentData: deduplicateAssignments(assignmentData, 'subParameter'),
            taskForce,
            accredInfoId,
            levelId,
            programId,
            areaId,
            parameterId,
            subParameterId: sub_parameter_id,
          }}
          handlers={{ handleProfileStackClick }}
          scope="subParameter"
        />
        <button
          title="Assign Task Force"
          onClick={(e) =>
            handleFileUserClick(e, {
              subParamId: sub_parameter_id,
              subParamUUID: sub_parameter_uuid,
              subParameter: sub_parameter,
            })
          }
          className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-700 shadow-sm hover:bg-slate-50 active:opacity-70 cursor-pointer"
        >
          <FileUser className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SubParamCard;
