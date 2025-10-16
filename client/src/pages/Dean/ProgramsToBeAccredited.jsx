import React, { useEffect, useMemo, useState, useRef } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { Archive, CalendarArrowUp, ClipboardPlus, EllipsisVertical, Folders, NotebookPen, NotepadText, Percent, Plus, PlusCircle, Scroll, Search, Trash2, X } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import { useProgramsToBeAccredited } from '../../hooks/Dean/useProgramsToBeAccredited';
import ProgramToBeAccreditedModal from '../../components/Dean/Accreditation/Programs/ProgramToBeAccreditedModal';
import ProgramsToBeAccreditedSL from '../../components/Loaders/ProgramsToBeAccreditedSL';
import Dropdown from '../../components/Dropdown/Dropdown';
import MODAL_TYPE from '../../constants/modalTypes';
import formatAccreditationTitle from '../../utils/formatAccreditationTitle';
import LEVEL from '../../constants/accreditationLevels';

const ProgramsToAccredit = () => {
  const { refs, datas, handlers } = useProgramsToBeAccredited();

  const {
    accredInfoOptionsRef,
    programOptionsRef,
    programCardRef,
    titleInputRef,
    levelInputRef,
    levelRef,
    programInputRef,
    scrollContainerRef
  } = refs;

  const {
    disableButton,
    toggleDropdown,
    duplicateValues,
    isAllDuplicates,
    accredInfoLevelPrograms,
    loading,
    error,
    formValue,
    infoHover,
    modalType,
    modalData,
    activeAccredInfoID,
    activeProgramID,
    programInput,
    programs,
    accredBodiesData,
    progressData,
    loadingProgramProgress,
    errorProgramProgress,
    refetchProgramProgress
  } = datas;

  const {
    handleAddClick,
    handleClipboardClick,
    handleCloseClick,
    handleChevronClick,
    handleConfirmClick,
    handleOptionSelection,
    handleInfoHover,
    handleInputChange,
    handleProgramCardClick,
    handleOptionClick,
    handleOptionItemClick,
    handleLevelScroll,
    handleProgramChange,
    handleAddProgramValue,
    handleRemoveProgramValue,
    handleSave
  } = handlers;

  // -----------------------------
  // Search state & behavior
  // -----------------------------
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (showSearch) {
      // focus when opening search
      searchInputRef.current?.focus();
    }
  }, [showSearch]);

  const normalize = (v) => (v?.toString?.().toLowerCase().trim() ?? '');

  // Array of Programs To Be Accredited, fallback to empty array if fetch is loading
  const rawData = useMemo(() => accredInfoLevelPrograms?.data ?? [], [accredInfoLevelPrograms]);

  // Filter by title, year, level, and program
  const filteredData = useMemo(() => {
    if (!query) return rawData;
    const q = normalize(query);
    return rawData.filter((item) => {
      const title = normalize(item?.accreditationInfo?.accred_title);
      const year = normalize(item?.accreditationInfo?.accred_year);
      const level = normalize(item?.level);
      const program = normalize(item?.program?.program);
      return (
        title.includes(q) ||
        year.includes(q) ||
        level.includes(q) ||
        program.includes(q) ||
        `${title} ${year}`.includes(q)
      );
    });
  }, [rawData, query]);

  // Group by Accreditation Year + Title
  const grouped = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      // Use accred_title + accred_year as unique key
      const accredTitle = `${item.accreditationInfo.accred_title} ${item.accreditationInfo.accred_year}`;

      if (!acc[accredTitle]) {
        acc[accredTitle] = {};
      }

      if (!acc[accredTitle][item.level]) {
        acc[accredTitle][item.level] = [];
      }

      acc[accredTitle][item.level].push({
        ...item.program,       // { program_uuid, program }
        level: item.level,
        accred_id: item.accreditationInfo.id,
        accred_uuid: item.accreditationInfo.accred_uuid,
        accred_year: item.accreditationInfo.accred_year,
        accred_title: item.accreditationInfo.accred_title,
        accred_body_name: item.accreditationInfo.accred_body
      });

      return acc;
    }, {});
  }, [filteredData]);

  console.log(grouped);

  // Function to make input ref dynamic based on the rendered modal
  const getInputRef = () => {
    if (modalType === MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED && !formValue?.title) {
      return titleInputRef;

    } else if (modalType === MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED_CARD && !programInput) {
      return programInputRef;

    } else if (modalType === MODAL_TYPE.ADD_LEVEL_PROGRAM && !formValue?.level) {
      return levelInputRef;
    }
  }

  const inputRef = getInputRef();

  // Options for Period
  const accredInfoOptions = [
    { icon: <CalendarArrowUp size={24} />, label: 'Update info' },
    { icon: <Archive size={24} />, label: 'Move to Archive' },
    { icon: <Trash2 size={24} />, label: 'Delete'}
  ];

  const programOptions = [
    { icon: <Folders size={22} />, label: 'View Areas' },
    { icon: <Archive size={22} />, label: 'Move to Archive' },
    { icon: <Trash2 size={24} />, label: 'Delete'}
  ];

  return (
    <DeanLayout>
      <div className='flex-1'>
        {/* Header */}
        <div className='sticky top-0 flex items-center justify-between py-2 px-4 bg-slate-900 border-l border-b border-slate-700 z-50 mb-8'>
          <h2 className='text-xl text-slate-100 font-bold'>
            Programs
          </h2>

          {/* Search toggle / input */}
          {showSearch ? (
            <div className='relative w-full max-w-md'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400' />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setQuery('');
                    setShowSearch(false);
                  }
                }}
                placeholder='Search title, year, level, or program…'
                className='pl-10 pr-10 py-2 rounded-full bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-transparent w-full transition-all'
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setQuery('');
                }}
                className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-700 text-slate-300 cursor-pointer'
                title='Close search'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className='text-slate-100 p-2 hover:bg-slate-700 rounded-full cursor-pointer active:scale-95'
              title='Search'
            >
              <Search className='h-6 w-6'/>
            </button>
          )}
        </div>

        {/* Add button */}
        <button 
          title='Add new accreditation' 
          onClick={handleAddClick} 
          className='fixed bottom-6 right-10 flex items-center justify-center gap-2 p-4 rounded-full cursor-pointer transition-all shadow-lg bg-slate-600 hover:bg-slate-700 active:opacity-90 z-50'
        >
          <Plus className='text-white' size={28}/>
        </button>

        {/* Render fallback UI if data is empty */}
        {loading ? (
          <ProgramsToBeAccreditedSL /> 
        ) : Object.entries(grouped).length === 0 ? (
          <div className='flex flex-col items-center justify-center h-100'>
            <Scroll className='text-slate-400 h-40 w-40 md:h-60 md:w-60'/>
            <p className='text-center font-medium text-slate-100 text-lg md:text-xl'>
              {rawData.length === 0 && !query ? (
                <>No accreditation data yet. Click '+' to add</>
              ) : (
                <>No results for “<span className='text-green-400'>{query}</span>”. Try a different search.</>
              )}
            </p>
          </div>
        ) : (
          /* Render Accreditation Info, Level, and Programs to be accredited */
          Object.entries(grouped).map(([accredTitle, levels], index) => {
            const [first, rest] = formatAccreditationTitle(accredTitle, { isForUI: true });
            // Get the first level
            const firstLevel = Object.keys(levels)[0];

            // Get the first program in that level
            const firstProgram = levels[firstLevel][0];

            // Now access the UUIDs
            const accredInfoUUID = firstProgram.accred_uuid;
            const accredYear = firstProgram.accred_year;
            const accredBody = firstProgram.accred_body_name;

            return (
              <React.Fragment key={index}>
                <div 
                  ref={scrollContainerRef}
                  className='relative border rounded-lg flex flex-col bg-slate-900 m-4 pb-15 p-4 shadow-lg overflow-auto border-slate-700 '
                >
                  <div id={accredTitle} className='relative w-full h-100 bg-[url("/pit-bg.jpg")] bg-cover bg-center rounded-lg'>
                    <div className='absolute inset-0 bg-black/70 rounded-lg border border-slate-700 shadow shadow-slate-800'></div>
                    {/* Content */}
                    <div className='absolute flex top-2 right-2'>
                      <img 
                        src='/cgs-logo.png' 
                        alt='CGS Logo' 
                        loading='lazy'
                        className='h-12 md:h-14 lg:h-16 w-auto'
                      />
                    </div>
                    <div className='absolute flex top-2 left-2'>
                      <img 
                        src='/pit-logo-outlined.png' 
                        alt='' 
                        loading='lazy' 
                        className='h-12 md:h-14 lg:h-16 w-auto'
                      />
                    </div>
                    <div className='relative flex flex-col items-center justify-center h-full'>
                      <p className='flex flex-col text-center items-center justify-center space-y-5'>
                        <span className='text-6xl md:text-7xl lg:text-8xl text-yellow-400 font-bold tracking-wide'>
                          {String(first).toUpperCase()}
                        </span>
                        <span className='text-white text-2xl md:text-3xl lg:text-5xl font-bold tracking-wide'>
                          {String(rest).toUpperCase()}
                        </span>
                      </p>
                      <hr className='w-1/2 lg:w-1/3 border-t-8 border-green-500 my-4' />
                      <p>
                        <span className='text-white text-md md:text-lg lg:text-xl font-bold'>
                          {Object.entries(levels).map(([level], index, arr) => (
                            <React.Fragment key={index}>
                              <span
                                onClick={() => handleLevelScroll(`${accredTitle}-${level}`)} 
                                className='hover:underline cursor-pointer tracking-wider'>
                                {String(level).toUpperCase()}
                              </span>
                              {/* Only show the dot if it's not the last item */}
                              {index !== arr.length - 1 && (
                                <span>
                                  {'\n'}&#8226;{'\n'}
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </span>
                      </p>
                    </div>
                    {/* Options for Accreditation Header */}
                    <button 
                      onClick={(e) => (
                        handleOptionClick(e, { 
                          isFromAccredInfo: true,
                          data: {
                            accredInfoId: accredInfoUUID
                          }
                        }))}
                      title='Options'
                      className='absolute bottom-2 p-2 right-3 text-white rounded-full hover:bg-slate-200/50 active:opacity-50 transition cursor-pointer'>
                      <EllipsisVertical size={28}/>
                    </button>
                    <button
                      onClick={() => {
                        const [title, year] = formatAccreditationTitle(accredTitle, { isForDB: true });
                        handleClipboardClick({
                          title,
                          year,
                          accredBody
                        });
                      }}
                      title='Add level and programs'
                      className='absolute bottom-2 p-2 right-15 text-white rounded-full hover:bg-slate-200/50 active:opacity-50 transition cursor-pointer'
                    >
                      <ClipboardPlus size={28}/>
                    </button>
                    {/* Render period options if the Options button is clicked */}
                    {activeAccredInfoID === accredInfoUUID && (
                      <div ref={accredInfoOptionsRef} className='absolute top-54 right-48 z-10 space-y-2 p-2 '>
                        <Dropdown 
                          key={accredInfoUUID}
                          width='h-auto w-50' 
                          border='border border-slate-400 rounded-md' 
                        >
                          {accredInfoOptions.map((option, index) => (
                            <React.Fragment key={index}>
                              {option.label === 'Delete' && (
                                <hr className='m-1 text-slate-300'></hr>
                              )}
                              <div 
                                onClick={(e) => (
                                  handleOptionItemClick(e, {
                                    isFromAccredInfo: true,
                                    optionName: option.label,
                                    accredInfo: {
                                      title: firstProgram.accred_title,
                                      year: accredYear,
                                      accredBody
                                    }
                                  })
                                )}
                                key={index} 
                                className={`flex items-center p-2 justify-start gap-x-2 cursor-pointer rounded-md active:opacity-60 transition ${option.label === 'Delete' ? 
                                'hover:bg-red-200' : 'hover:bg-slate-200'}`}
                              >
                                <i className={option.label === 'Delete' ? 'text-red-500' : 'text-slate-800'}>
                                  {option.icon}
                                </i>
                                <p className={option.label === 'Delete' ? 'text-red-500' : 'text-slate-800'}>
                                  {option.label}
                                </p>
                              </div>
                            </React.Fragment>
                          ))}
                        </Dropdown>
                      </div>
                    )}
                  </div>
                  {/* Loop through levels inside each period */}
                  {Object.entries(levels).map(([level, programs]) => (
                    <React.Fragment key={level} >
                      {console.log(programs)}
                      <hr className='w-[75%] bg-slate-600 border border-transparent my-16 mx-auto'></hr>
                      <div className='mx-auto'>
                        <p className='text-xl md:text-2xl lg:text-3xl text-center tracking-wider font-extrabold text-yellow-400 mb-4'>
                          {level === LEVEL.PRELIM ? 'Programs Under Survey' : 'Programs To Be Accredited'}
                        </p>
                      </div>
                      <div
                        ref={(el) => (levelRef.current[`${accredTitle}-${level}`] = el)} 
                        id={`${accredTitle}-${level}`}
                        className='relative p-4 space-y-6 mb-4 bg-slate-800 border border-slate-700 rounded-lg'
                      >
                        {/* Level label (ex: Level II, Preliminary, etc.) */}
                        <h2 className='absolute top-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-[60%] md:w-[50%] lg:w-[40%] p-2 text-lg md:text-xl lg:text-2xl text-slate-100 rounded font-extrabold tracking-wide'>
                          {level.toUpperCase()}
                        </h2>
                        <hr className='w-[50%] bg-green-500 border border-transparent mt-12 h-1 mx-auto'></hr>

                        {/* Program cards */}
                        <div className='relative flex flex-wrap gap-10 justify-center pb-4 px-4 '>
                          {activeProgramID && <div className='absolute inset-0 z-20'></div>}
                          {programs.map((programObj, id) => {
                            /* 
                              Use this id (programId) in passing the data because id is an index
                              and it starts with zero and when activeProgramId === 0
                              then that would be false and won't render the dropdown options 
                              of the first program card. Never rely on 2nd parameter on map, only
                              use it in keys. Also, include the periodKey in id, 
                              not just level and programName because there mignt be cases that 
                              level and programName is the same in the different period.
                            */
                            const accredId = programObj.accred_id;
                            const accredLevel = String(programObj.level).toLowerCase().replace(/\s+/g, '-');
                            const programId = `${accredTitle}-${level}-${programObj.program_uuid}`;
                            const programUUID = programObj?.program_uuid;
                            const program = programObj?.program;
                            return (
                              <div
                                key={programUUID}
                                ref={programCardRef}
                                id={`last-program-${programId}`}
                                onClick={(e) => {
                                  handleProgramCardClick(e, {
                                    data: {
                                      accredTitle,
                                      level,
                                      accredInfoUUID,
                                      programUUID,
                                      program,
                                      programId
                                    }
                                  })}
                                }
                                
                                className='relative flex items-center justify-center h-100 p-8 shadow-md border border-slate-600 hover:shadow-slate-700 transition w-100 bg-[url("/pit-bg-5.png")] bg-cover bg-center rounded-lg cursor-pointer'
                              >
                                <div className='absolute inset-0 bg-black/60 z-10 rounded-lg'></div>
                                <div 
                                  id={`${accredBody}-${accredYear}-${level}-${program}`}
                                  className='z-20'
                                >
                                   <p className='text-center leading-snug tracking-widest text-yellow-300 text-xl md:text-2xl lg:text-4xl font-bold'>
                                    {program}
                                  </p>
                                </div>
                                {/* Render program options when option button is clicked */}
                                {activeProgramID === programId && (
                                  <>
                                    <div className='absolute inset-0 z-20'></div>
                                    <div ref={programOptionsRef} className='absolute top-6 right-47 z-20 space-y-2 p-2 '>
                                      <Dropdown 
                                        key={id}
                                        width='h-auto w-50' 
                                        border='border border-slate-400 rounded-md' 
                                      >
                                        {programOptions.map((option, index) => (
                                          <React.Fragment key={index}>
                                            {option.label === 'Delete' && (
                                              <hr className='m-1 text-slate-300'></hr>
                                            )}
                                            <div 
                                              onClick={(e) => (
                                                handleOptionItemClick(e, { 
                                                  from: { program: true },
                                                  optionName: option.label,
                                                  accredInfo: {
                                                    accredInfoUUID,
                                                    accredTitle: firstProgram.accred_title,
                                                    accredYear,
                                                    accredBody,
                                                    level,
                                                    programUUID,
                                                    program,
                                                    programId
                                                  }
                                                }))}
                                              key={index} 
                                              className={`flex items-center p-2 justify-start gap-x-2 cursor-pointer rounded-md active:opacity-60 ${option.label === 'Delete' ? 
                                              'hover:bg-red-200' : 'hover:bg-slate-200'}`}
                                            >
                                              <i className={option.label === 'Delete' ? 'text-red-500' : 'text-slate-800'}>
                                                {option.icon}
                                              </i>
                                              <p className={`text-sm ${option.label === 'Delete' ? 'text-red-500' : 'text-slate-800'}`}>
                                                {option.label}
                                              </p>
                                            </div>
                                          </React.Fragment>
                                        ))}
                                      </Dropdown>
                                    </div>
                                  </>
                                )}

                                {/* Option button for Program Cards */}
                                <button 
                                  onClick={(e) => (
                                    handleOptionClick(e, { 
                                      isFromProgram: true,
                                      data: {
                                        accredTitle: firstProgram.accred_title,
                                        level,
                                        programId
                                      }
                                    }))}
                                  title='Options'
                                  className='absolute top-2 p-2 right-2 text-slate-100 rounded-full hover:shadow hover:text-slate-200 hover:bg-slate-100/20 active:opacity-50 transition cursor-pointer z-10'>
                                  <EllipsisVertical size={24}/>
                                </button>
                                {progressData.map((item, index) => {
                                  console.log(item);
                                  const matchAccredInfo = item.accreditation_info_id === accredId;
                                  console.log(matchAccredInfo);
                                  const matchLevel = String(item.level_name).toLowerCase().split(' ').join('-') === accredLevel;
                                  console.log(String(item.level_name).toLowerCase().replace(/\s+/g, '-'));
                                  console.log(accredLevel);
                                  console.log(matchLevel);
                                  const matchProgram = item.program_id === programObj.id;
                                  console.log(matchProgram);

                                  return (matchAccredInfo && matchLevel && matchProgram) && (
                                    <div className='w-90 flex items-center justify-start rounded-full border border-white absolute bottom-3 left-1/2 -translate-x-1/2 z-20 h-4'>
                                      <div style={{ width: `${item.progress}%`}} className='bg-green-500 h-3 rounded-full'>
                                        
                                      </div>
                                      <p className='absolute -top-5 right-0 text-sm text-white text-end'>{Number(item.progress).toFixed(2)}%</p>
                                      <p className='absolute -top-5 left-0 text-sm text-white text-end'>Status</p>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          )}

                          {/* Card button for adding program */}
                          <div
                            onClick={() => handleAddClick({ 
                              isFromCard: true, 
                              data: { 
                                accredTitle: firstProgram.accred_title,
                                accredYear,
                                accredBody,
                                level
                              }  
                            })}
                            title='Click to add program'
                            className='relative flex flex-col items-center justify-center gap-y-2 h-100 p-4 bg-slate-900 shadow-slate-700 hover:shadow-md active:shadow cursor-pointer transition-all w-100 rounded-lg border border-slate-700 active:scale-95'
                          >
                            <PlusCircle className='text-slate-100 h-20 w-20 rounded-full'/>
                            <p className='text-xl font-medium text-slate-100 py-3 px-8 rounded-full cursor-pointer'>
                              Add Programs
                            </p>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                {index !== Object.entries(grouped).length - 1 && (
                  <hr className='w-[90%] bg-green-600 border border-transparent h-3 my-20 mx-auto' />
                )}
              </React.Fragment>
            );
          })
        )}
        
      </div>
      

      {/* Modal */}
      <ProgramToBeAccreditedModal
        ref={inputRef} 
        toggleDropdown={toggleDropdown}
        modalData={modalData}
        infoHover={infoHover}
        modalType={modalType}
        formValue={formValue}
        programs={programs}
        programInput={programInput}
        isAllDuplicates={isAllDuplicates}
        duplicateValues={duplicateValues}
        disableButton={disableButton}
        accredBodiesData={accredBodiesData}
        handlers={{
          handleChevronClick,
          handleCloseClick,
          handleConfirmClick,
          handleSave,
          handleInputChange,
          handleOptionSelection,
          handleAddProgramValue,
          handleRemoveProgramValue,
          handleProgramChange,
          handleInfoHover,
        }}
      />
    </DeanLayout>
  );
};

export default ProgramsToAccredit;