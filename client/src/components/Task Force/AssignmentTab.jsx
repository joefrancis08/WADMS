import React from 'react'
import { toga } from '../../assets/icons';
import { ChevronDown, EllipsisVertical, FileText, Folder, FolderOpen, LoaderCircle, Pen, Trash2, Upload } from 'lucide-react';
import Dropdown from '../Dropdown/Dropdown';

const AssignmentTab = ({ refs = {},states = {}, data = {}, handlers = {} }) => {
  const { 
    docOptionRef,
  } = refs;

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
     <div className='bg-slate-900 border-t border-slate-700 mt-2 mb-8 min-h-100 p-2'>
      {Object.keys(groupedAssignments || {}).length > 0 ? (
        Object.entries(groupedAssignments).map(([accredKey, levels]) => (
          <div
            key={accredKey}
            className='flex flex-col items-center px-5 pb-5 pt-8 gap-y-6 md:px-15 justify-evenly'
          >
            {/* Accred Title + Year */}
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
                        <h4 className='text-slate-100 text-lg md:text-xl pt-2 font-bold'>
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
                            console.log(area);
                            const areaKey = `${accredID}-${levelID}-${programID}-${area.areaID}`;
                            return (
                            <div
                              key={area.areaID}
                              className='border border-slate-700 rounded-lg p-4 bg-slate-800'
                            >
                              {/* Area row */}
                              <div
                                onClick={() => handleDropdownClick({ 
                                  isShowParameter: true, 
                                  id: areaKey
                                })}
                                className='flex items-center justify-between gap-x-2 p-2 hover:bg-slate-700 rounded-lg cursor-pointer'
                              >
                              
                                <div className='relative flex items-center gap-x-2'>
                                  <FolderOpen className='text-yellow-500 fill-yellow-500' />
                                  <h5 className='text-base md:text-lg font-semibold text-slate-100'>
                                    {area.area}
                                  </h5>
                                  {activeParamId === areaKey && (
                                    <div className='absolute left-2.5 top-7 border-l border-b border-slate-500 rounded-bl w-5 h-8'></div>
                                  )}
                                </div>
                                {(area.parameters || []).length > 0 ? (
                                  <button
                                    onClick={() => handleDropdownClick({ 
                                      isShowParameter: true,
                                      id: areaKey
                                    })}
                                    className='ml-auto p-1 hover:bg-slate-700 rounded-full z-20'
                                    title='Toggle parameters'
                                  >
                                    <ChevronDown
                                      className={`text-slate-100 transition ${activeParamId === areaKey ? 'rotate-180' : ''}`}
                                    />
                                  </button>
                                ) : (
                                    <button 
                                    onClick={() => console.log('Area Upload Click!')}
                                    className='text-slate-100 p-1 rounded-full hover:bg-slate-600 z-20 cursor-pointer active:scale-96'>
                                      <Upload size={22}/>
                                    </button>
                                )}
                              </div>
                              {(area.parameters || []).length === 0 && (
                                <div className='flex items-center gap-x-2 ml-5 hover:bg-slate-700 p-1 rounded-md cursor-pointer'>
                                  <FileText className='text-slate-100' size={20}/>
                                  <p className='text-slate-100 text-sm'>Example File</p>
                                </div>
                              )}
                              
                              {/* Parameters */}
                              {activeParamId === areaKey &&
                                (area.parameters || []).map((param) => {
                                  const paramKey = `${areaKey}-${param.parameterID}`;
                                  
                                  return (
                                  <div key={param.parameterID} className='ml-8'>
                                    <div
                                      onClick={() => handleDropdownClick({ 
                                        isShowSubParam: true,
                                        id: paramKey
                                      })}
                                      className='flex items-center justify-between gap-x-2 p-2 hover:bg-slate-700 rounded-lg cursor-pointer'
                                    >
                                      <div className='relative flex items-center gap-x-2'>
                                        <Folder className='text-yellow-500 fill-yellow-500' />
                                        <p className='font-medium text-slate-200'>
                                          {param.parameter}
                                        </p>
                                        {activeSubparamId === paramKey && (
                                          <div className='absolute left-2.5 top-7 border-l border-b border-slate-500 rounded-bl w-5 h-8'></div>
                                        )}
                                      </div>
                                      {(param.subParameters || []).length > 0 ? (
                                        <button
                                          onClick={() => handleDropdownClick({ isShowSubParam: true })}
                                          className='ml-auto p-1 hover:bg-slate-700 rounded-full'
                                          title='Toggle sub-parameters'
                                        >
                                          <ChevronDown
                                            className={`text-slate-100 transition ${activeSubparamId === paramKey ? 'rotate-180' : ''}`}
                                          />
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleUploadClick()} 
                                          className='text-slate-100 p-1 rounded-full hover:bg-slate-600 z-20 cursor-pointer active:scale-96'>
                                          <Upload />
                                        </button>
                                      )}
                                    </div>
                                    {(param.subParameters || []).length === 0 && (
                                      <div className='flex items-center gap-x-2 ml-5 hover:bg-slate-700 p-1 rounded-md cursor-pointer'>
                                        <FileText className='text-slate-100' size={20}/>
                                        <p className='text-slate-100 text-sm'>Example File</p>
                                      </div>
                                    )}

                                    {/* Sub-Parameters */}
                                    {activeSubparamId === paramKey &&
                                      (param.subParameters || []).map((sub) => {
                                        const subParamKey = `${paramKey}-${sub.subParameterID}`;
                                        return (
                                        <div key={sub.subParameterID} className='ml-8'>
                                          <div
                                            onClick={() => handleDropdownClick({ 
                                              isShowIndicator: true,
                                              id: subParamKey 
                                            })}
                                            className='flex items-center justify-between gap-x-2 p-2 hover:bg-slate-700 rounded-lg cursor-pointer'
                                          >
                                            <div className='flex items-center gap-2'>
                                              <Folder className='text-yellow-500 fill-yellow-500' />
                                              <p className='text-slate-200'>
                                                {sub.subParameter}
                                              </p>
                                            </div>
                                            {(sub.indicators || []).length > 0 ? (
                                              <button
                                                onClick={() => handleDropdownClick({ 
                                                  isShowIndicator: true,
                                                  id: subParamKey
                                                })}
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
                                          <div className='flex flex-col gap-y-1'>
                                            {(sub.indicators || []).length === 0 && (
                                              loadingUploaderDocuments ? (
                                                selectedFiles[sub.subParameterID] && (
                                                  <div className='flex items-center gap-x-2 ml-5 hover:bg-slate-700 p-1 rounded-md cursor-pointer'>
                                                    {selectedFiles[sub.subParameterID].map((file, idx) => (
                                                      <div key={idx} className='flex items-center gap-x-2 truncate max-w-100px'>
                                                        <LoaderCircle className='text-slate-100 animate-spin' size={20}/>
                                                        <p className='text-slate-100 text-sm'>{file.name}</p>
                                                      </div>  
                                                    ))}
                                                  </div>
                                                )
                                              ) : (
                                                uploaderDocs.length > 0 && uploaderDocs
                                                  .filter(doc => (
                                                    doc.accredInfoID === accredID &&
                                                    doc.levelID === levelID &&
                                                    doc.programID === programID
                                                  )).map((doc, idx) => {

                                                  return (
                                                    <div
                                                      key={idx}
                                                      className='relative flex items-center justify-between ml-5 px-3 py-2 cursor-pointer hover:bg-slate-700 transition-colors duration-150 group'
                                                    >
                                                      {activeDocId === doc.docID && (
                                                        <div className='absolute inset-0 z-30'></div>
                                                      )}
                                                      {/* Left section: icon + file name */}
                                                      <div className='relative flex items-center gap-x-2 min-w-0'>
                                                        <FileText className='text-slate-100 flex-shrink-0' size={20} />
                                                        <p className='truncate text-slate-100 text-sm max-w-[400px] block'>
                                                          {doc.docFileName}
                                                        </p>
                                                        {activeParamId === areaKey && (
                                                          <div className={`absolute -left-3 -top-5 border-l border-b border-slate-500 rounded-bl w-3 ${idx > 0 ? '-top-12 h-15' : '-top-5 h-8'}`}></div>
                                                        )}
                                                      </div>

                                                      {/* Right section: actions */}
                                                      <div className='relative'>
                                                        <button
                                                          onClick={() => handleDocOptionClick(doc.docID)}
                                                          className={`text-slate-300 hover:text-white p-1 rounded-full hover:bg-slate-600 active:scale-95 transition cursor-pointer ${activeDocId === doc.docID && 'bg-slate-600'}`}
                                                          title='Options'
                                                        >
                                                          <EllipsisVertical size={18} />
                                                        </button>

                                                        {/* Dropdown Menu */}
                                                        {activeDocId === doc.docID && (
                                                          <Dropdown
                                                            width='w-36'
                                                            border='border border-slate-600'
                                                            position='absolute -left-20 top-8 z-50 bg-slate-800 rounded-md shadow-lg'
                                                          >
                                                            <div ref={docOptionRef} className='flex flex-col text-sm text-slate-800'>
                                                              <button
                                                                onClick={() => console.log('Download', doc.docFileName)}
                                                                className='flex items-center gap-x-1 px-4 py-2 text-left hover:bg-slate-200 rounded-md transition cursor-pointer active:scale-98'
                                                              >
                                                                <Pen size={16}/>
                                                                Rename
                                                              </button>
                                                              <button
                                                                onClick={(e) => handleDelete(e, doc.docID)}
                                                                className='flex items-center gap-x-1 px-4 py-2 text-left hover:bg-red-100  rounded-md cursor-pointer transition text-red-500 active:scale-98'>
                                                                <Trash2 size={16}/>
                                                                Delete
                                                              </button>
                                                            </div>
                                                          </Dropdown>
                                                        )}
                                                      </div>
                                                    </div>
                                                  );
                                                })
                                              )
                                            )}
                                          </div>
                                          {/* Indicators */}
                                          {activeIndicatorId === subParamKey &&
                                            (sub.indicators || []).map((ind, idx) => (
                                              <div key={`${sub.subParameter}-${idx}`} className='ml-8'>
                                                <div className='flex items-center gap-x-2 p-2 hover:bg-slate-700 rounded-lg cursor-default'>
                                                  <Folder className='text-yellow-500 fill-yellow-500' />
                                                  <p className='text-slate-200'>{ind}</p>
                                                  <button
                                                    title='Upload'
                                                    onClick={() => console.log('Indicator Upload Click!')} 
                                                    className='text-slate-100 p-1 rounded-full hover:bg-slate-600 z-20 cursor-pointer active:scale-96'
                                                  >
                                                      <Upload size={22}/>
                                                  </button>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      )})}
                                  </div>
                                )})}
                            </div>
                          )})}
                        </div>
                      </div>
                    </div>
                  )})}
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className='flex gap-y-4 flex-col items-center justify-center h-100 w-full py-16'>
          <p className='text-lg text-slate-300'>
            Not assigned.{' '}
            <span className='text-slate-100 font-semibold hover:underline cursor-pointer active:opacity-80'>
              Assign
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignmentTab;
