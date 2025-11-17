import { useRef, useState, useEffect } from 'react';
import { checkList, toga } from '../../assets/icons';
import {
  EllipsisVertical,
  FileText,
  LoaderCircle,
  Pen,
  Trash2,
} from 'lucide-react';
import AreaSection from './AreaSection';

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

                        {console.log(groupedAssignments)}

                        return (
                          <AreaSection 
                            accredID={accredID}
                            levelID={levelID}
                            programID={programID}
                            area={area}
                            areaKey={areaKey}
                            hasParams={hasParams}
                            activeParamId={activeParamId}
                            activeSubparamId={activeSubparamId}
                            activeIndicatorId={activeIndicatorId}
                            loadingUploaderDocuments={loadingUploaderDocuments}
                            activeDocId={activeDocId}
                            docOptionRef={docOptionRef}
                            handleDropdownClick={handleDropdownClick}
                            handleUploadClick={handleUploadClick}
                            handleFileChange={handleFileChange}
                            handleDocOptionClick={handleDocOptionClick}
                            handleDelete={handleDelete}
                            selectedFiles={selectedFiles}
                            uploaderDocs={uploaderDocs}
                            user={user}
                            makeSelectionKey={makeSelectionKey}
                            filterDocs={filterDocs}
                            resolveLevel={resolveLevel}
                          />
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
