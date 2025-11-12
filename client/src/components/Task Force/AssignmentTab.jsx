import React from 'react'
import { checkList, toga } from '../../assets/icons';
import {
  ChevronDown,
  EllipsisVertical,
  FileText,
  Folder,
  FolderOpen,
  LoaderCircle,
  Pen,
  Trash2,
  Upload
} from 'lucide-react';
import Dropdown from '../Dropdown/Dropdown';

/** Utility to build a stable selection key per level */
const makeSelectionKey = ({
  accredID,
  levelID,
  programID,
  areaID,
  parameterID,
  subParameterID,
  indicatorID
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

/** Determine the intended level from the ids we’re rendering under */
const resolveLevel = (ids) => {
  if (ids.indicatorID !== undefined && ids.indicatorID !== null) return 'indicator';
  if (ids.subParameterID) return 'subparameter';
  if (ids.parameterID) return 'parameter';
  if (ids.areaID) return 'area';
  return 'program'; // fallback (unused)
};

/** Strict filter: include docs ONLY for the nearest (most specific) target level */
const filterDocs = (docs, ids) => {
  const level = resolveLevel(ids);

  return (docs || []).filter(doc => {
    // ancestry must match
    if (doc.accredInfoID !== ids.accredID) return false;
    if (doc.levelID !== ids.levelID) return false;
    if (doc.programID !== ids.programID) return false;

    // enforce exact level ownership
    if (level === 'area') {
      return doc.areaID === ids.areaID
        && !doc.parameterID
        && !doc.subParameterID
        && (doc.indicatorID === undefined || doc.indicatorID === null);
    }

    if (level === 'parameter') {
      return doc.areaID === ids.areaID
        && doc.parameterID === ids.parameterID
        && !doc.subParameterID
        && (doc.indicatorID === undefined || doc.indicatorID === null);
    }

    if (level === 'subparameter') {
      return doc.areaID === ids.areaID
        && doc.parameterID === ids.parameterID
        && doc.subParameterID === ids.subParameterID
        && (doc.indicatorID === undefined || doc.indicatorID === null);
    }

    if (level === 'indicator') {
      const matchesIndicator =
        doc.indicatorID === ids.indicatorID || doc.indicatorIndex === ids.indicatorID;

      return doc.areaID === ids.areaID
        && doc.parameterID === ids.parameterID
        && doc.subParameterID === ids.subParameterID
        && matchesIndicator;
    }

    return false;
  });
};

/** Reusable document list + upload-in-progress renderer */
const DocList = ({
  ids,                 // { accredID, levelID, programID, areaID?, parameterID?, subParameterID?, indicatorID? }
  uploaderDocs,
  selectedFiles,
  loadingUploaderDocuments,
  /* connector logic depends on whether parent wanted a branch at all */
  areaKeyForBranch,
  activeDocId,
  handleDocOptionClick,
  handleDelete,
  docOptionRef,
}) => {
  const selectionKey = makeSelectionKey(ids);
  const docsForLevel = filterDocs(uploaderDocs, ids);
  const uploadingFiles = selectedFiles?.[selectionKey];

  // Only draw the connector when the parent wants it AND there are no docs at this level.
  const drawBranch = Boolean(areaKeyForBranch) && docsForLevel.length === 0;

  const levelLabelMap = {
    area: 'area',
    parameter: 'parameter',
    subparameter: 'sub-parameter',
    indicator: 'indicator',
  };
  const emptyLevelLabel = levelLabelMap[resolveLevel(ids)] || 'level';

  const showEmpty =
    !loadingUploaderDocuments &&
    (!uploadingFiles || uploadingFiles.length === 0) &&
    docsForLevel.length === 0;

  return (
    <div className="flex flex-col gap-y-1">
      {loadingUploaderDocuments ? (
        uploadingFiles && uploadingFiles.length > 0 && (
          <div className='flex items-center gap-x-2 ml-5 hover:bg-slate-700 p-1 rounded-md cursor-pointer'>
            {uploadingFiles.map((file, idx) => (
              <div key={idx} className='flex items-center gap-x-2 truncate max-w-100px'>
                <LoaderCircle className='text-slate-100 animate-spin' size={20}/>
                <p className='text-slate-100 text-sm'>{file.name}</p>
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          {docsForLevel.map((doc, idx) => (
            <div
              key={doc.docID ?? idx}
              className='relative flex items-center justify-between ml-5 px-3 py-2 cursor-pointer hover:bg-slate-700 rounded-lg transition-colors duration-150 group'
            >
              <div className='relative flex items-center gap-x-2 min-w-0'>
                <FileText className='text-slate-100 flex-shrink-0' size={20} />
                <p className='truncate text-slate-100 text-sm max-w-[400px] block'>
                  {doc.docFileName}
                </p>
                {drawBranch && (
                  <div className={`absolute -left-3 -top-5 border-l border-b border-slate-500 rounded-bl w-3 ${idx > 0 ? '-top-12 h-15' : '-top-5 h-8'}`}></div>
                )}
              </div>

              <div className='relative'>
                <button
                  onClick={() => handleDocOptionClick(doc.docID)}
                  className={`text-slate-300 hover:text-white p-1 rounded-full hover:bg-slate-600 active:scale-95 transition cursor-pointer ${activeDocId === doc.docID && 'bg-slate-600'}`}
                  title='Options'
                >
                  <EllipsisVertical size={18} />
                </button>

                {activeDocId === doc.docID && (
                  <Dropdown
                    width='w-36'
                    border='border border-slate-600'
                    position='absolute -left-20 top-8 z-50 bg-slate-800 rounded-md shadow-lg'
                  >
                    <div ref={docOptionRef} className='flex flex-col text-sm text-slate-800'>
                      <button
                        onClick={() => console.log('Rename', doc.docFileName)}
                        className='flex items-center gap-x-1 px-4 py-2 text-left hover:bg-slate-200 rounded-md transition cursor-pointer active:scale-98'
                      >
                        <Pen size={16}/>
                        Rename
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, doc.docID)}
                        className='flex items-center gap-x-1 px-4 py-2 text-left hover:bg-red-100 rounded-md cursor-pointer transition text-red-500 active:scale-98'
                      >
                        <Trash2 size={16}/>
                        Delete
                      </button>
                    </div>
                  </Dropdown>
                )}
              </div>
            </div>
          ))}

          {showEmpty && (
            <div className="ml-5 px-3 py-2 rounded-md border border-dashed border-slate-600 text-slate-400 text-sm">
              No documents yet for this {emptyLevelLabel}.
            </div>
          )}
        </>
      )}
    </div>
  );
};

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
    uploaderDocs = []
  } = data;

  const {
    handleDropdownClick = () => {},
    handleUploadClick = () => {},
    handleFileChange = () => {},
    handleDocOptionClick = () => {},
    handleDelete = () => {}
  } = handlers;

  return (
    <div className='bg-slate-900 mt-2 mb-8 min-h-100 p-2'>
      {Object.keys(groupedAssignments || {}).length > 0 ? (
        Object.entries(groupedAssignments).map(([accredKey, levels]) => (
          <div
            key={accredKey}
            className='flex flex-col items-center px-5 pb-5 pt-8 gap-y-6 md:px-15 justify-evenly'
          >
            {/* Accred Title */}
            <div className='flex flex-col gap-y-1 items-center justify-center'>
              <h2 className='text-2xl md:text-3xl text-slate-100 font-bold tracking-wide'>
                {accredKey}
              </h2>
            </div>

            {/* Levels */}
            {Object.entries(levels || {}).map(([levelKey, programs]) => (
              <div key={levelKey} className='flex flex-col gap-y-4 items-center w-full'>
                <h4 className='text-base md:text-lg lg:text-xl text-green-900 font-extrabold bg-slate-100 px-4 py-1 rounded-md -mt-4'>
                  {levelKey}
                </h4>

                {/* Programs */}
                {Object.values(programs || {}).map((program) => {
                  const accredID = program.accredID;
                  const levelID = program.levelID;
                  const programID = program.programID;

                  return (
                    <div
                      key={program.programID}
                      className='w-full max-w-[50rem] rounded-xl border border-slate-700 bg-slate-900 shadow'
                    >
                      <div className='flex flex-col gap-y-2 items-center justify-center p-4'>
                        <h4 className='text-slate-100 text-lg font-bold border-b border-slate-700 pb-2 mb-3'>
                          Assigned Program, Areas, & Parameters
                        </h4>

                        {/* Program banner */}
                        <div className='bg-gradient-to-b from-green-700 to-amber-300 w-full rounded-lg'>
                          <div className='relative flex items-center justify-center py-10'>
                            <img
                              src={toga}
                              alt='Toga Icon'
                              loading='lazy'
                              className='opacity-10 h-40 w-40'
                            />
                            <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-2xl md:text-3xl text-white font-bold'>
                              {program.program}
                            </p>
                          </div>
                        </div>

                        {/* Areas */}
                        <div className='flex flex-col gap-4 w-full'>
                          {(program.areas || []).map((area) => {
                            const areaKey = `${accredID}-${levelID}-${programID}-${area.areaID}`;
                            const hasParams = (area.parameters || []).length > 0;

                            return (
                              <div
                                key={area.areaID}
                                className='border border-slate-700 rounded-lg p-4 bg-slate-800'
                              >
                                {/* Area row */}
                                <div
                                  onClick={hasParams ? () => handleDropdownClick({ isShowParameter: true, id: areaKey }) : undefined}
                                  className={`flex items-center justify-between gap-x-2 p-2 rounded-lg ${hasParams ? 'hover:bg-slate-700 cursor-pointer' : 'cursor-default'}`}
                                >
                                  <div className='relative flex items-center gap-x-2'>
                                    <FolderOpen className='text-yellow-500 fill-yellow-500' />
                                    <h5 className='text-base md:text-lg font-semibold text-slate-100'>
                                      {area.area}
                                    </h5>
                                  </div>

                                  {hasParams ? (
                                    <button
                                      onClick={() => handleDropdownClick({ isShowParameter: true, id: areaKey })}
                                      className='ml-auto p-1 hover:bg-slate-700 rounded-full z-20'
                                      title='Toggle parameters'
                                    >
                                      <ChevronDown className={`text-slate-100 transition ${activeParamId === areaKey ? 'rotate-180' : ''}`} />
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        title='Upload'
                                        onClick={() => handleUploadClick(area.areaID)}
                                        className='text-slate-100 p-1 rounded-full hover:bg-slate-600 z-20 cursor-pointer active:scale-96'>
                                        <Upload size={22}/>
                                      </button>
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

                                {/* Area-level docs (render only when no parameters) */}
                                {!hasParams && (
                                  <DocList
                                    ids={{ accredID, levelID, programID, areaID: area.areaID }}
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

                                {/* Parameters */}
                                {activeParamId === areaKey &&
                                  (area.parameters || []).map((param) => {
                                    const paramKey = `${areaKey}-${param.parameterID}`;
                                    const hasSubParams = (param.subParameters || []).length > 0;

                                    return (
                                      <div key={param.parameterID} className='ml-8'>
                                        <div
                                          onClick={hasSubParams ? () => handleDropdownClick({ isShowSubParam: true, id: paramKey }) : undefined}
                                          className={`flex items-center justify-between gap-x-2 p-2 rounded-lg ${hasSubParams ? 'hover:bg-slate-700 cursor-pointer' : 'cursor-default'}`}
                                        >
                                          <div className='relative flex items-center gap-x-2'>
                                            <Folder className='text-yellow-500 fill-yellow-500' />
                                            <p className='font-medium text-slate-200'>
                                              {param.parameter}
                                            </p>
                                          </div>

                                          {hasSubParams ? (
                                            <button
                                              onClick={() => handleDropdownClick({ isShowSubParam: true, id: paramKey })}
                                              className='ml-auto p-1 hover:bg-slate-700 rounded-full'
                                              title='Toggle sub-parameters'
                                            >
                                              <ChevronDown className={`text-slate-100 transition ${activeSubparamId === paramKey ? 'rotate-180' : ''}`} />
                                            </button>
                                          ) : (
                                            <>
                                              <button
                                                title='Upload'
                                                onClick={() => handleUploadClick(param.parameterID)}
                                                className='text-slate-100 p-1 rounded-full hover:bg-slate-600 z-20 cursor-pointer active:scale-96'>
                                                <Upload />
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

                                        {/* Parameter-level docs (render only when no sub-parameters) */}
                                        {!hasSubParams && (
                                          <DocList
                                            ids={{ accredID, levelID, programID, areaID: area.areaID, parameterID: param.parameterID }}
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

                                        {/* Sub-Parameters */}
                                        {activeSubparamId === paramKey &&
                                          (param.subParameters || []).map((sub) => {
                                            const subParamKey = `${paramKey}-${sub.subParameterID}`;
                                            const hasIndicators = (sub.indicators || []).length > 0;

                                            return (
                                              <div key={sub.subParameterID} className='ml-8'>
                                                <div
                                                  onClick={hasIndicators ? () => handleDropdownClick({ isShowIndicator: true, id: subParamKey }) : undefined}
                                                  className={`flex items-center justify-between gap-x-2 p-2 rounded-lg ${hasIndicators ? 'hover:bg-slate-700 cursor-pointer' : 'cursor-default'}`}
                                                >
                                                  <div className='flex items-center gap-2'>
                                                    <Folder className='text-yellow-500 fill-yellow-500' />
                                                    <p className='text-slate-200'>
                                                      {sub.subParameter}
                                                    </p>
                                                  </div>

                                                  {hasIndicators ? (
                                                    <button
                                                      onClick={() => handleDropdownClick({ isShowIndicator: true, id: subParamKey })}
                                                      className='ml-auto p-1 hover:bg-slate-700 rounded-full z-20'
                                                      title='Toggle indicators'
                                                    >
                                                      <ChevronDown
                                                        className={`text-slate-100 transition ${activeIndicatorId === subParamKey ? 'rotate-180' : ''}`}
                                                      />
                                                    </button>
                                                  ) : (
                                                    <>
                                                      <button
                                                        title='Upload'
                                                        onClick={() => handleUploadClick(sub.subParameterID)}
                                                        className='text-slate-100 p-1 rounded-full hover:bg-slate-600 z-20 cursor-pointer active:scale-96'>
                                                        <Upload size={22}/>
                                                      </button>
                                                      <input
                                                        multiple
                                                        id={`file-input-${sub.subParameterID}`}
                                                        type='file'
                                                        onChange={(e) => handleFileChange(e, sub.subParameterID)}
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

                                                {/* Sub-parameter-level docs (render only when no indicators) */}
                                                {!hasIndicators && (
                                                  <DocList
                                                    ids={{ accredID, levelID, programID, areaID: area.areaID, parameterID: param.parameterID, subParameterID: sub.subParameterID }}
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
                                                      <div key={indicatorKey} className='ml-8'>
                                                        <div className='flex items-center gap-x-2 p-2 hover:bg-slate-700 rounded-lg cursor-default'>
                                                          <Folder className='text-yellow-500 fill-yellow-500' />
                                                          <p className='text-slate-200'>{ind}</p>
                                                          <>
                                                            <button
                                                              title='Upload'
                                                              onClick={() => handleUploadClick(`IND-${sub.subParameterID}-${idx}`)}
                                                              className='text-slate-100 p-1 rounded-full hover:bg-slate-600 z-20 cursor-pointer active:scale-96'
                                                            >
                                                              <Upload size={22}/>
                                                            </button>
                                                            <input
                                                              multiple
                                                              id={`file-input-ind-${sub.subParameterID}-${idx}`}
                                                              type='file'
                                                              onChange={(e) => handleFileChange(e, `IND-${sub.subParameterID}-${idx}`)}
                                                              accept='application/pdf,image/*'
                                                              className='hidden'
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
                                                            accredID, levelID, programID,
                                                            areaID: area.areaID,
                                                            parameterID: param.parameterID,
                                                            subParameterID: sub.subParameterID,
                                                            indicatorID: idx
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
                                                  })
                                                }
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
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className='flex gap-y-4 flex-col items-center justify-center h-100 w-full py-16'>
          <img src={checkList} alt='Check List Icon' className='w-62 h-62'/>
          <p className='text-lg text-slate-300'>
            No assignments yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignmentTab;
