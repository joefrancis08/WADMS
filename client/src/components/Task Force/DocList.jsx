import React, { useRef, useState, useEffect } from 'react';
import { EllipsisVertical, FileText, LoaderCircle, Pen, Trash2 } from 'lucide-react';

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
  const buttonRef = useRef(null);

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

  // Compute dropdown position when opened
  useEffect(() => {
    if (activeDocId && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
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
            ref={buttonRef}
            onClick={() => handleDocOptionClick(doc.docID)}
            title='Options'
            className={`doc-option-btn p-1.5 rounded-full hover:bg-slate-100 text-slate-500 active:scale-95 transition cursor-pointer ${
              activeDocId === doc.docID && 'bg-slate-100'
            }`}
          >
            <EllipsisVertical size={18} />
          </button>

          {/* Floating dropdown menu */}
          {activeDocId === doc.docID && menuPos && (
            <div
              className='doc-options-menu fixed z-[9999] w-40 bg-white border border-slate-200 rounded-md shadow-xl'
              style={{
                top: `${menuPos.top}px`,
                left: `${menuPos.left}px`,
              }}
            >
              <div
                ref={docOptionRef}
                className='flex flex-col text-sm text-slate-700'
              >
                <button
                  onClick={() => console.log('Rename', doc.docFileName)}
                  className='flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-md transition text-left'
                >
                  <Pen size={15} /> Rename
                </button>
                <button
                  onClick={(e) => handleDelete(e, doc.docID)}
                  className='flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition text-left'
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Empty state */}
      {showEmpty && (
        <div className='ml-5 px-3 py-2 rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-sm'>
          No documents yet for this {emptyLabel}.
        </div>
      )}
    </div>
  );
};

export default DocList;
