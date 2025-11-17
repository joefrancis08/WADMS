import React, { useRef, useState, useEffect } from 'react';
import { checkList, toga } from '../../assets/icons';
import {
  ChevronDown,
  EllipsisVertical,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  LoaderCircle,
  Pen,
  Trash2,
  Upload,
  UserPlus,
  UserRoundPlus,
} from 'lucide-react';
import Dropdown from '../Dropdown/Dropdown';
import { USER_ROLES } from '../../constants/user';

/** Utility: unique selection key per hierarchy level */
const makeSelectionKey = ({
  accredID,
  levelID,
  programID,
  areaID,
  parameterID,
  subParameterID,
  indicatorID,
}) => {
  const parts = [
    accredID && `ACC:${accredID}`,
    levelID && `LVL:${levelID}`,
    programID && `PRG:${programID}`,
    areaID && `ARE:${areaID}`,
    parameterID && `PAR:${parameterID}`,
    subParameterID && `SUB:${subParameterID}`,
    (indicatorID ?? indicatorID === 0) && `IND:${indicatorID}`,
  ].filter(Boolean);
  return parts.join('|');
};

/** Determine nesting depth */
const resolveLevel = (ids) => {
  if (ids.indicatorID !== undefined && ids.indicatorID !== null) return 'indicator';
  if (ids.subParameterID) return 'subparameter';
  if (ids.parameterID) return 'parameter';
  if (ids.areaID) return 'area';
  return 'program';
};

/** Filter documents to the nearest applicable level */
const filterDocs = (docs, ids) => {
  const level = resolveLevel(ids);
  return (docs || []).filter((doc) => {
    if (doc.accredInfoID !== ids.accredID) return false;
    if (doc.levelID !== ids.levelID) return false;
    if (doc.programID !== ids.programID) return false;

    if (level === 'area')
      return (
        doc.areaID === ids.areaID &&
        !doc.parameterID &&
        !doc.subParameterID &&
        (doc.indicatorID === undefined || doc.indicatorID === null)
      );

    if (level === 'parameter')
      return (
        doc.areaID === ids.areaID &&
        doc.parameterID === ids.parameterID &&
        !doc.subParameterID &&
        (doc.indicatorID === undefined || doc.indicatorID === null)
      );

    if (level === 'subparameter')
      return (
        doc.areaID === ids.areaID &&
        doc.parameterID === ids.parameterID &&
        doc.subParameterID === ids.subParameterID &&
        (doc.indicatorID === undefined || doc.indicatorID === null)
      );

    if (level === 'indicator') {
      const match =
        doc.indicatorID === ids.indicatorID || doc.indicatorIndex === ids.indicatorID;
      return (
        doc.areaID === ids.areaID &&
        doc.parameterID === ids.parameterID &&
        doc.subParameterID === ids.subParameterID &&
        match
      );
    }

    return false;
  });
};

/** Document list renderer (handles uploading + options) */
const DocList = ({
  ids,
  uploaderDocs,
  selectedFiles,
  loadingUploaderDocuments,
  areaKeyForBranch,
  activeDocId,
  handleDocOptionClick,
  handleDelete,
  docOptionRef,
}) => {
  const [menuPos, setMenuPos] = useState(null);
  const buttonRefs = useRef({});

  const selectionKey = makeSelectionKey(ids);
  const docsForLevel = filterDocs(uploaderDocs, ids);
  const uploadingFiles = selectedFiles?.[selectionKey];
  const drawBranch = Boolean(areaKeyForBranch) && docsForLevel.length === 0;

  const levelLabelMap = {
    area: 'area',
    parameter: 'parameter',
    subparameter: 'sub-parameter',
    indicator: 'indicator',
  };
  const emptyLabel = levelLabelMap[resolveLevel(ids)] || 'level';

  const showEmpty =
    !loadingUploaderDocuments &&
    (!uploadingFiles || uploadingFiles.length === 0) &&
    docsForLevel.length === 0;

  // Compute dropdown position when a document is active
  useEffect(() => {
    if (activeDocId && buttonRefs.current[activeDocId]) {
      const rect = buttonRefs.current[activeDocId].getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 6,
        left: rect.right - 150,
      });
    } else {
      setMenuPos(null);
    }
  }, [activeDocId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuPos &&
        !e.target.closest('.doc-options-menu') &&
        !e.target.closest('.doc-option-btn')
      ) {
        handleDocOptionClick(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuPos, handleDocOptionClick]);

  return (
    <div className='flex flex-col gap-y-1 mt-2'>
      {/* Upload progress */}
      {loadingUploaderDocuments &&
        uploadingFiles?.length > 0 &&
        uploadingFiles.map((file, idx) => (
          <div
            key={idx}
            className='ml-6 flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-1 text-emerald-700 text-sm'
          >
            <LoaderCircle className='animate-spin text-slate-500' size={18} />
            <span>{file.name}</span>
          </div>
        ))}

      {/* Uploaded docs */}
      {docsForLevel.map((doc, idx) => (
        <div
          key={doc.docID ?? idx}
          className='relative flex items-center justify-between ml-5 px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition group'
        >
          <div className='flex items-center gap-2 min-w-0'>
            <FileText className='text-slate-500 flex-shrink-0' size={18} />
            <p className='truncate text-slate-700 text-sm max-w-[400px]'>
              {doc.docFileName}
            </p>
            {drawBranch && (
              <div className='absolute -left-3 -top-4 border-l border-b border-slate-200 rounded-bl w-3 h-6' />
            )}
          </div>

          <button
            ref={(el) => (buttonRefs.current[doc.docID] = el)}
            onClick={() => handleDocOptionClick(doc.docID)}
            title='Options'
            className={`doc-option-btn p-1.5 rounded-full hover:bg-slate-100 text-slate-500 active:scale-95 transition cursor-pointer ${
              activeDocId === doc.docID && 'bg-slate-100'
            }`}
          >
            <EllipsisVertical size={18} />
          </button>
        </div>
      ))}

      {/* Floating dropdown menu */}
      {activeDocId && menuPos && (
        <div
          className='doc-options-menu fixed z-[9999] w-40 bg-white border border-slate-200 rounded-md shadow-xl'
          style={{
            top: `${menuPos.top}px`,
            left: `${menuPos.left}px`,
          }}
        >
          <div ref={docOptionRef} className='flex flex-col text-sm text-slate-700'>
            <button
              onClick={() => console.log('Rename')}
              className='flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-md transition text-left'
            >
              <Pen size={15} /> Rename
            </button>
            <button
              onClick={(e) => handleDelete(e, activeDocId)}
              className='flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition text-left'
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {showEmpty && (
        <div className='ml-5 px-3 py-2 rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-sm'>
          No documents yet for this {emptyLabel}.
        </div>
      )}
    </div>
  );
};

/** === MAIN COMPONENT === */
const AssignmentTab = ({ refs = {}, states = {}, data = {}, handlers = {} }) => {
  const { docOptionRef } = refs;
  const {
    activeParamId,
    activeSubparamId,
    activeIndicatorId,
    activeDocId,
    loadingUploaderDocuments,
  } = states;
  const {
    groupedAssignments = [],
    selectedFiles = [],
    uploaderDocs = [],
    user
  } = data;
  const {
    handleDropdownClick = () => {},
    handleUploadClick = () => {},
    handleFileChange = () => {},
    handleDocOptionClick = () => {},
    handleDelete = () => {},
  } = handlers;

  console.log(user);

  if (Object.keys(groupedAssignments || {}).length === 0)
    return (
      <div className='flex flex-col items-center justify-center h-[70vh] gap-6'>
        <img src={checkList} alt='Checklist Icon' className='w-44 h-44 opacity-80' />
        <p className='text-slate-600 text-lg font-medium'>No assignments yet.</p>
      </div>
    );

  return (
    <div className='bg-slate-50 py-6'>
      {Object.entries(groupedAssignments).map(([accredKey, levels]) => (
        <div
          key={accredKey}
          className='flex flex-col items-center px-4 pb-4'
        >
          <h2 className='text-3xl font-extrabold text-emerald-700 tracking-wide text-center'>
            {accredKey}
          </h2>

          {Object.entries(levels).map(([levelKey, programs]) => (
            <div key={levelKey} className='w-full max-w-5xl'>
              <div className='flex justify-center mb-8'>
                <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold px-8 py-1 rounded-full shadow-md border border-emerald-400'>
                  <span className='tracking-wide uppercase'>{levelKey}</span>
                </div>
              </div>

              {Object.values(programs).map((program) => {
                const accredID = program.accredID;
                const levelID = program.levelID;
                const programID = program.programID;

                return (
                  <div
                    key={program.programID}
                    className='rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden mb-10'
                  >
                    {/* Program banner */}
                    <div className='relative bg-gradient-to-r from-emerald-700 to-emerald-500 py-12 text-center'>
                      <img
                        src={toga}
                        alt='Toga Icon'
                        className='absolute inset-0 m-auto opacity-10 h-40 w-40'
                      />
                      <p className='relative z-10 text-white text-2xl md:text-3xl font-bold'>
                        {program.program}
                      </p>
                    </div>

                    <div className='p-6 flex flex-col gap-4'>
                      <h4 className='text-emerald-700 text-lg font-semibold border-b border-slate-200 pb-2'>
                        Assigned Areas and Parameters
                      </h4>

                      {/* === Areas === */}
                      {(program.areas || []).map((area) => {
                        const areaKey = `${accredID}-${levelID}-${programID}-${area.areaID}`;
                        const hasParams = (area.parameters || []).length > 0;

                        return (
                          <div
                            key={area.areaID}
                            className='border border-slate-200 rounded-lg p-4 bg-slate-50'
                          >
                            {/* Area Row */}
                            <div
                              onClick={
                                hasParams
                                  ? () =>
                                      handleDropdownClick({
                                        isShowParameter: true,
                                        id: areaKey,
                                      })
                                  : undefined
                              }
                              className={`flex items-center justify-between p-2 rounded-lg ${
                                hasParams ? 'hover:bg-slate-100 cursor-pointer' : ''
                              }`}
                            >
                              <div className='flex items-center gap-2'>
                                <FolderOpen className='text-slate-500' />
                                <h5 className='text-base font-semibold text-slate-800'>
                                  {area.area}
                                </h5>
                              </div>

                              {hasParams ? (
                                <ChevronDown
                                  className={`transition text-slate-500 ${
                                    activeParamId === areaKey
                                      && 'rotate-180'
                                  }`}
                                />
                              ) : (
                                <>
                                  {/* <button
                                    title='Upload'
                                    onClick={() => handleUploadClick(area.areaID)}
                                    className='text-slate-500 hover:bg-slate-50 p-1.5 rounded-full active:scale-95'
                                  >
                                    <Upload size={20} />
                                  </button> */}

                                  {/* If user role is Task Force Chair, he/she can add parameter */}
                                  {!hasParams && user.role === USER_ROLES.TASK_FORCE_CHAIR && (
                                    <button
                                      title='Add parameter'
                                      className='cursor-pointer p-2 rounded-full hover:bg-slate-200 active:scale-98'
                                    >
                                      <FolderPlus size={22}/>
                                    </button>
                                  )}
                                  <input
                                    multiple
                                    id={`file-input-area-${area.areaID}`}
                                    type='file'
                                    onChange={(e) => handleFileChange(e, area.areaID)}
                                    accept='application/pdf,image/*'
                                    className='hidden'
                                    data-accred-info-id={accredID}
                                    data-level-id={levelID}
                                    data-program-id={programID}
                                    data-area-id={area.areaID}
                                  />
                                </>
                              )}
                            </div>

                            {/* === Parameters === */}
                            {activeParamId === areaKey &&
                              (area.parameters || []).map((param) => {
                                const paramKey = `${areaKey}-${param.parameterID}`;
                                const hasSubParams = (param.subParameters || []).length > 0;

                                return (
                                  <div key={param.parameterID} className='ml-8 mt-3'>
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
                                        hasSubParams
                                          ? 'hover:bg-slate-100 cursor-pointer'
                                          : ''
                                      }`}
                                    >
                                      <div className='flex items-center gap-2'>
                                        <Folder className='text-slate-500' />
                                        <p className='text-slate-800 font-medium'>
                                          {param.parameter}
                                        </p>
                                        {user.role === USER_ROLES.TASK_FORCE_CHAIR && (
                                          <button
                                            title='Assign Member' 
                                            onClick={(e) => e.stopPropagation()}
                                            className='ml-1 hover:bg-slate-200 p-1 rounded-full cursor-pointer active:scale-95'>
                                            <UserRoundPlus size={18}/>
                                          </button>
                                        )}
                                      </div>

                                      {hasSubParams ? (
                                        <ChevronDown
                                          className={`transition text-slate-500 ${
                                            activeSubparamId === paramKey
                                              && 'rotate-180'
                                          }`}
                                        />
                                      ) : (
                                        <>
                                          <button
                                            title='Upload'
                                            onClick={() =>
                                              handleUploadClick(param.parameterID)
                                            }
                                            className='text-slate-500 hover:bg-emerald-50 p-1.5 rounded-full active:scale-95'
                                          >
                                            <Upload size={20} />
                                          </button>
                                          <input
                                            multiple
                                            id={`file-input-param-${param.parameterID}`}
                                            type='file'
                                            onChange={(e) => handleFileChange(e, param.parameterID)}
                                            accept='application/pdf,image/*'
                                            className='hidden'
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
                                      />
                                    )}

                                    {/* === Subparameters === */}
                                    {activeSubparamId === paramKey &&
                                      (param.subParameters || []).map((sub) => {
                                        const subParamKey = `${paramKey}-${sub.subParameterID}`;
                                        const hasIndicators =
                                          (sub.indicators || []).length > 0;

                                        return (
                                          <div key={sub.subParameterID} className='ml-8 mt-3'>
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
                                                hasIndicators
                                                  ? 'hover:bg-emerald-50 cursor-pointer'
                                                  : ''
                                              }`}
                                            >
                                              <div className='flex items-center gap-2'>
                                                <Folder className='text-slate-500' />
                                                <p className='text-slate-800'>
                                                  {sub.subParameter}
                                                </p>
                                              </div>

                                              {hasIndicators ? (
                                                <ChevronDown
                                                  className={`transition text-slate-500 ${
                                                    activeIndicatorId === subParamKey
                                                      && 'rotate-180'
                                                  }`}
                                                />
                                              ) : (
                                                <>
                                                  <button
                                                    title='Upload'
                                                    onClick={() =>
                                                      handleUploadClick(sub.subParameterID)
                                                    }
                                                    className='text-slate-500 hover:bg-slate-50 p-1.5 rounded-full active:scale-95 cursor-pointer'
                                                  >
                                                    <Upload size={20} />
                                                  </button>
                                                  <input
                                                    multiple
                                                    id={`file-input-${sub.subParameterID}`}
                                                    type='file'
                                                    onChange={(e) =>
                                                      handleFileChange(e, sub.subParameterID)
                                                    }
                                                    accept='application/pdf,image/*'
                                                    className='hidden'
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
                                                loadingUploaderDocuments={
                                                  loadingUploaderDocuments
                                                }
                                                areaKeyForBranch={areaKey}
                                                activeDocId={activeDocId}
                                                handleDocOptionClick={handleDocOptionClick}
                                                handleDelete={handleDelete}
                                                docOptionRef={docOptionRef}
                                              />
                                            )}

                                            {/* === Indicators === */}
                                            {activeIndicatorId === subParamKey &&
                                              (sub.indicators || []).map((ind, idx) => {
                                                const indicatorKey = `${subParamKey}-IND-${idx}`;
                                                return (
                                                  <div
                                                    key={indicatorKey}
                                                    className='ml-8 mt-3'
                                                  >
                                                    <div className='flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50'>
                                                      <Folder className='text-slate-500' />
                                                      <p className='text-slate-800'>{ind}</p>
                                                      <>
                                                        <button
                                                          title='Upload'
                                                          onClick={() =>
                                                            handleUploadClick(
                                                              `IND-${sub.subParameterID}-${idx}`
                                                            )
                                                          }
                                                          className='text-slate-500 hover:bg-slate-50 p-1.5 rounded-full active:scale-95 cursor-pointer'
                                                        >
                                                          <Upload size={20} />
                                                        </button>
                                                        <input
                                                          multiple
                                                          id={`file-input-ind-${sub.subParameterID}-${idx}`}
                                                          type='file'
                                                          onChange={(e) =>
                                                            handleFileChange(
                                                              e,
                                                              `IND-${sub.subParameterID}-${idx}`
                                                            )
                                                          }
                                                          accept='application/pdf,image/*'
                                                          className='hidden'
                                                          data-accred-info-id={accredID}
                                                          data-level-id={levelID}
                                                          data-program-id={programID}
                                                          data-area-id={area.areaID}
                                                          data-param-id={param.parameterID}
                                                          data-sub-parameter-id={
                                                            sub.subParameterID
                                                          }
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
                                                      loadingUploaderDocuments={
                                                        loadingUploaderDocuments
                                                      }
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
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AssignmentTab;
