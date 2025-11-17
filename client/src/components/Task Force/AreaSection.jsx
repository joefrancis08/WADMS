import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  Folder,
  FolderOpen,
  FolderPlus,
  Upload,
  UserRoundPlus,
} from 'lucide-react';
import { USER_ROLES } from '../../constants/user';
import DocList from './DocList';
import useFetchAreaTaskForce from '../../hooks/fetch-react-query/useFetchAreaTaskForce';
import MODAL_TYPES from '../../constants/modalTypes';
import AreaAssignmentModal from './AreaAssignmentModal';

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

// Utility: Remove duplicate users by userId
const deduplicateUsers = (users = []) => {
  const seen = new Set();
  return users.filter((user) => {
    if (seen.has(user.userId)) return false;
    seen.add(user.userId);
    return true;
  });
};

const AreaSection = ({
  accredID,
  levelID,
  programID,
  area,
  areaKey,
  hasParams,
  activeParamId,
  activeSubparamId,
  activeIndicatorId,
  loadingUploaderDocuments,
  activeDocId,
  docOptionRef,
  handleDropdownClick,
  handleUploadClick,
  handleFileChange,
  handleDocOptionClick,
  handleDelete,
  makeSelectionKey,
  filterDocs,
  resolveLevel,
  selectedFiles,
  uploaderDocs,
  user,
}) => {
  // Fetch task force members for this area
  const { areaTaskForceData, loadingATFD, errorATFD, refetchATFD } = useFetchAreaTaskForce({
    accredInfoId: accredID,
    levelId: levelID,
    programId: programID,
    areaId: area.areaID,
  });
  const areaTaskForce = useMemo(() => areaTaskForceData.data ?? [], [areaTaskForceData]);

  console.log(areaTaskForceData);

  // Deduplicate the list
  const uniqueTaskForce = useMemo(() => {
    return deduplicateUsers(areaTaskForce);
  }, [areaTaskForce]);

  // States
  const [modalType, setModalType] = useState(null);

  const handleAreaClick = () => {
    setModalType(MODAL_TYPES.TASK_FORCE_AREA_ASSIGNMENT);
    hasParams
      ? () =>
          handleDropdownClick({
            isShowParameter: true,
            id: areaKey,
          })
      : undefined
  };

  const handleCloseModal = () => setModalType(null);

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
      {/* Area Header */}
      <div
        onClick={hasParams ? handleAreaClick : null}
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2 py-4 rounded-lg ${
          hasParams ? 'hover:bg-slate-200 cursor-pointer' : ''
        }`}
      >
        {console.log(modalType)}
        <div className="flex items-center gap-2 flex-wrap">
          <FolderOpen className="text-slate-500 flex-shrink-0" />
          <h5 className="text-base font-semibold text-slate-800">{area.area}</h5>
        </div>

        {/* Action Buttons */}
        {hasParams ? (
          <ChevronDown
            className={`transition text-slate-500 ${
              activeParamId === areaKey ? 'rotate-180' : ''
            }`}
          />
        ) : (
          <div className="flex items-center gap-2">
            {/* Add Parameter (only for Chair) */}
            {!hasParams && user.role === USER_ROLES.TASK_FORCE_CHAIR && (
              <button
                title="Add parameter"
                className="cursor-pointer p-2 rounded-full hover:bg-slate-200 active:scale-98"
              >
                <FolderPlus size={22} />
              </button>
            )}

            {/* Hidden file input (kept for consistency) */}
            <input
              multiple
              id={`file-input-area-${area.areaID}`}
              type="file"
              onChange={(e) => handleFileChange(e, area.areaID)}
              accept="application/pdf,image/*"
              className="hidden"
              data-accred-info-id={accredID}
              data-level-id={levelID}
              data-program-id={programID}
              data-area-id={area.areaID}
            />
          </div>
        )}
      </div>

      <hr className='text-slate-300 w-full my-3'></hr>

      {/* Show unique task force members (optional detailed view) */}
      {!loadingATFD && uniqueTaskForce.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-md text-slate-900 font-semibold">
            Team <span className='text-sm font-normal'>({uniqueTaskForce.length} Task Force{uniqueTaskForce.length !== 1 ? 's' : ''})</span>
          </p>
          {uniqueTaskForce.map((u) => (
            <div
              key={u.userId}
              className="flex items-center gap-1.5 text-sm text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm w-[30%]"
              title={`${u.fullName} — ${u.role}`}
            >
              <img
                src={
                  u?.profilePicPath?.startsWith?.('http')
                    ? u.profilePicPath
                    : `${PROFILE_PIC_PATH}/${u?.profilePicPath || 'default-profile-picture.png'}`
                }
                alt={u?.fullName ? `${u.fullName}'s profile picture` : 'Task force profile picture'}
                className='h-6 w-6 rounded-full object-cover'
                loading='lazy'
              />
              <span className="font-medium">
                {u.fullName}
              </span>
              <span className="text-slate-500">
                ({u.role === USER_ROLES.TASK_FORCE_CHAIR ? 'Chair' : 'Member'})
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Parameters (only when expanded) */}
      {activeParamId === areaKey &&
        (area.parameters || []).map((param) => {
          const paramKey = `${areaKey}-${param.parameterID}`;
          const hasSubParams = (param.subParameters || []).length > 0;

          return (
            <div key={param.parameterID} className="ml-8 mt-3">
              <div
                onClick={
                  hasSubParams
                    ? () =>
                        handleDropdownClick({
                          isShowSubParam: true,
                          id: paramKey,
                        })
                    : undefined
                }
                className={`flex items-center justify-between p-2 rounded-lg ${
                  hasSubParams ? 'hover:bg-slate-100 cursor-pointer' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="text-slate-500" />
                  <p className="text-slate-800 font-medium">{param.parameter}</p>
                  {user.role === USER_ROLES.TASK_FORCE_CHAIR && (
                    <button
                      title="Assign Member"
                      onClick={(e) => e.stopPropagation()}
                      className="ml-1 hover:bg-slate-200 p-1 rounded-full cursor-pointer active:scale-95"
                    >
                      <UserRoundPlus size={18} />
                    </button>
                  )}
                </div>

                {hasSubParams ? (
                  <ChevronDown
                    className={`transition text-slate-500 ${
                      activeSubparamId === paramKey ? 'rotate-180' : ''
                    }`}
                  />
                ) : (
                  <>
                    <button
                      title="Upload"
                      onClick={() => handleUploadClick(param.parameterID)}
                      className="text-slate-500 hover:bg-emerald-50 p-1.5 rounded-full active:scale-95"
                    >
                      <Upload size={20} />
                    </button>
                    <input
                      multiple
                      id={`file-input-param-${param.parameterID}`}
                      type="file"
                      onChange={(e) => handleFileChange(e, param.parameterID)}
                      accept="application/pdf,image/*"
                      className="hidden"
                      data-accred-info-id={accredID}
                      data-level-id={levelID}
                      data-program-id={programID}
                      data-area-id={area.areaID}
                      data-param-id={param.parameterID}
                    />
                  </>
                )}
              </div>

              {/* Parameter-level docs */}
              {!hasSubParams && (
                <DocList
                  ids={{
                    accredID,
                    levelID,
                    programID,
                    areaID: area.areaID,
                    parameterID: param.parameterID,
                  }}
                  uploaderDocs={uploaderDocs}
                  selectedFiles={selectedFiles}
                  loadingUploaderDocuments={loadingUploaderDocuments}
                  areaKeyForBranch={areaKey}
                  activeDocId={activeDocId}
                  handleDocOptionClick={handleDocOptionClick}
                  handleDelete={handleDelete}
                  docOptionRef={docOptionRef}
                  makeSelectionKey={makeSelectionKey}
                  filterDocs={filterDocs}
                  resolveLevel={resolveLevel}
                />
              )}

              {/* Subparameters */}
              {activeSubparamId === paramKey &&
                (param.subParameters || []).map((sub) => {
                  const subParamKey = `${paramKey}-${sub.subParameterID}`;
                  const hasIndicators = (sub.indicators || []).length > 0;

                  return (
                    <div key={sub.subParameterID} className="ml-8 mt-3">
                      <div
                        onClick={
                          hasIndicators
                            ? () =>
                                handleDropdownClick({
                                  isShowIndicator: true,
                                  id: subParamKey,
                                })
                            : undefined
                        }
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          hasIndicators ? 'hover:bg-emerald-50 cursor-pointer' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Folder className="text-slate-500" />
                          <p className="text-slate-800">{sub.subParameter}</p>
                        </div>

                        {hasIndicators ? (
                          <ChevronDown
                            className={`transition text-slate-500 ${
                              activeIndicatorId === subParamKey ? 'rotate-180' : ''
                            }`}
                          />
                        ) : (
                          <>
                            <button
                              title="Upload"
                              onClick={() => handleUploadClick(sub.subParameterID)}
                              className="text-slate-500 hover:bg-slate-50 p-1.5 rounded-full active:scale-95 cursor-pointer"
                            >
                              <Upload size={20} />
                            </button>
                            <input
                              multiple
                              id={`file-input-${sub.subParameterID}`}
                              type="file"
                              onChange={(e) => handleFileChange(e, sub.subParameterID)}
                              accept="application/pdf,image/*"
                              className="hidden"
                              data-accred-info-id={accredID}
                              data-level-id={levelID}
                              data-program-id={programID}
                              data-area-id={area.areaID}
                              data-param-id={param.parameterID}
                              data-sub-parameter-id={sub.subParameterID}
                            />
                          </>
                        )}
                      </div>

                      {/* Subparameter-level docs */}
                      {!hasIndicators && (
                        <DocList
                          ids={{
                            accredID,
                            levelID,
                            programID,
                            areaID: area.areaID,
                            parameterID: param.parameterID,
                            subParameterID: sub.subParameterID,
                          }}
                          uploaderDocs={uploaderDocs}
                          selectedFiles={selectedFiles}
                          loadingUploaderDocuments={loadingUploaderDocuments}
                          areaKeyForBranch={areaKey}
                          activeDocId={activeDocId}
                          handleDocOptionClick={handleDocOptionClick}
                          handleDelete={handleDelete}
                          docOptionRef={docOptionRef}
                        />
                      )}

                      {/* Indicators */}
                      {activeIndicatorId === subParamKey &&
                        (sub.indicators || []).map((ind, idx) => {
                          const indicatorKey = `${subParamKey}-IND-${idx}`;
                          return (
                            <div key={indicatorKey} className="ml-8 mt-3">
                              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50">
                                <Folder className="text-slate-500" />
                                <p className="text-slate-800">{ind}</p>
                                <>
                                  <button
                                    title="Upload"
                                    onClick={() =>
                                      handleUploadClick(`IND-${sub.subParameterID}-${idx}`)
                                    }
                                    className="text-slate-500 hover:bg-slate-50 p-1.5 rounded-full active:scale-95 cursor-pointer"
                                  >
                                    <Upload size={20} />
                                  </button>
                                  <input
                                    multiple
                                    id={`file-input-ind-${sub.subParameterID}-${idx}`}
                                    type="file"
                                    onChange={(e) =>
                                      handleFileChange(e, `IND-${sub.subParameterID}-${idx}`)
                                    }
                                    accept="application/pdf,image/*"
                                    className="hidden"
                                    data-accred-info-id={accredID}
                                    data-level-id={levelID}
                                    data-program-id={programID}
                                    data-area-id={area.areaID}
                                    data-param-id={param.parameterID}
                                    data-sub-parameter-id={sub.subParameterID}
                                    data-indicator-id={idx}
                                  />
                                </>
                              </div>

                              {/* Indicator-level docs */}
                              <DocList
                                ids={{
                                  accredID,
                                  levelID,
                                  programID,
                                  areaID: area.areaID,
                                  parameterID: param.parameterID,
                                  subParameterID: sub.subParameterID,
                                  indicatorID: idx,
                                }}
                                uploaderDocs={uploaderDocs}
                                selectedFiles={selectedFiles}
                                loadingUploaderDocuments={loadingUploaderDocuments}
                                areaKeyForBranch={areaKey}
                                activeDocId={activeDocId}
                                handleDocOptionClick={handleDocOptionClick}
                                handleDelete={handleDelete}
                                docOptionRef={docOptionRef}
                              />
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
            </div>
          );
        })}
      <AreaAssignmentModal 
        modalType={modalType}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default AreaSection;