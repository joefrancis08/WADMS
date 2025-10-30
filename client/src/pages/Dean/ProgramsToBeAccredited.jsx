import React, { useEffect, useMemo, useState, useRef } from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { Archive, CalendarArrowUp, ClipboardPlus, EllipsisVertical, Folders, Scroll, Search, Trash2, Plus } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import { useProgramsToBeAccredited } from '../../hooks/Dean/useProgramsToBeAccredited';
import ProgramToBeAccreditedModal from '../../components/Dean/Accreditation/Programs/ProgramToBeAccreditedModal';
import ProgramsToBeAccreditedSL from '../../components/Loaders/ProgramsToBeAccreditedSL';
import Dropdown from '../../components/Dropdown/Dropdown';
import MODAL_TYPE from '../../constants/modalTypes';
import formatAccreditationTitle from '../../utils/formatAccreditationTitle';
import LEVEL from '../../constants/accreditationLevels';
import { toga } from '../../assets/icons';
import { getProgressStyle } from '../../helpers/progressHelper';
import ProgressBar from '../../components/ProgressBar';

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

  // ----- Header Search (always visible) -----
  const [query, setQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const normalize = (v) => (v?.toString?.().toLowerCase().trim() ?? '');

  const rawData = useMemo(() => accredInfoLevelPrograms?.data ?? [], [accredInfoLevelPrograms]);

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

  const grouped = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const accredTitle = `${item.accreditationInfo.accred_title} ${item.accreditationInfo.accred_year}`;
      if (!acc[accredTitle]) acc[accredTitle] = {};
      if (!acc[accredTitle][item.level]) acc[accredTitle][item.level] = [];
      acc[accredTitle][item.level].push({
        ...item.program,
        ilpmId: item.ilpmId,
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

  // Dynamic modal input focus
  const getInputRef = () => {
    if (modalType === MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED && !formValue?.title) return titleInputRef;
    if (modalType === MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED_CARD && !programInput) return programInputRef;
    if (modalType === MODAL_TYPE.ADD_LEVEL_PROGRAM && !formValue?.level) return levelInputRef;
  };
  const inputRef = getInputRef();

  // Options (unchanged)
  const accredInfoOptions = [
    { icon: <CalendarArrowUp size={24} />, label: 'Update info' },
    { icon: <Archive size={24} />, label: 'Move to Archive' },
    { icon: <Trash2 size={24} />, label: 'Delete' }
  ];

  const programOptions = [
    { icon: <Folders size={22} />, label: 'View Areas' },
    { icon: <Archive size={22} />, label: 'Move to Archive' },
    { icon: <Trash2 size={24} />, label: 'Delete' }
  ];

  return (
    <DeanLayout>
      <div className='flex-1 bg-slate-50'>

        {/* ===== Sticky Header with persistent search ===== */}
        <div className='sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur'>
          <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3'>
            <h2 className='text-xl font-bold text-slate-900'>Accreditation</h2>

            <div className='flex items-center gap-3'>
              {/* Search input (always visible) */}
              <div className='relative w-full max-w-md'>
                <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
                <input
                  ref={searchInputRef}
                  type='text'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setQuery('');
                  }}
                  placeholder='Search title, year, level, or program...'
                  className='w-full rounded-full border border-slate-300 bg-white pl-10 pr-3 py-2 text-slate-900 placeholder-slate-400 outline-none ring-0 transition focus:border-emerald-400'
                />
              </div>

              {/* Add new accreditation period */}
              <button
                title='Add new accreditation'
                onClick={handleAddClick}
                className='min-w-30 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-600 px-3 py-2 text-white shadow-sm transition hover:bg-emerald-500 active:scale-95 cursor-pointer'
              >
                <Plus size={18} />
                <span className='text-sm font-medium'>Add new</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== Content ===== */}
        {loading ? (
          <div className='mx-auto max-w-7xl px-4 py-6'>
            <ProgramsToBeAccreditedSL />
          </div>
        ) : Object.entries(grouped).length === 0 ? (
          <div className='mx-auto max-w-7xl px-4 py-20'>
            <div className='flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm'>
              <Scroll className='h-20 w-20 text-slate-400' />
              <p className='mt-4 text-lg font-medium text-slate-700'>
                {rawData.length === 0 && !query ? (
                  <>No accreditation data yet. Click ‘+’ to add.</>
                ) : (
                  <>
                    No results for <span className='font-semibold text-emerald-700'>‘{query}’</span>. Try a different search.
                  </>
                )}
              </p>
            </div>
          </div>
        ) : (
          Object.entries(grouped).map(([accredTitle, levels], index) => {
            const [first, rest] = formatAccreditationTitle(accredTitle, { isForUI: true });
            const firstLevel = Object.keys(levels)[0];
            const firstProgram = levels[firstLevel][0];
            const accredInfoUUID = firstProgram.accred_uuid;
            const accredYear = firstProgram.accred_year;
            const accredBody = firstProgram.accred_body_name;

            return (
              <React.Fragment key={index}>
                {/* Accreditation Period Header */}
                <section id={accredTitle} className='relative z-[40] mx-auto mt-6 max-w-7xl px-4'>
                  {/* keep overflow-visible to avoid clipping dropdown */}
                  <div className='relative isolate overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm'>
                    {/* Banner gets the rounding; parent stays overflow-visible */}
                    <div className='relative h-40 w-full rounded-2xl bg-emerald-700 ring-1 ring-emerald-900/15'>

                      {/* Title + level jump (unchanged) */}
                      <div className='absolute inset-0 flex items-center justify-center p-6'>
                        <div className='text-center'>
                          <p className='text-2xl font-bold tracking-wide text-white md:text-3xl lg:text-4xl'>
                            {String(first).toUpperCase()}
                          </p>
                          <p className='text-lg font-semibold tracking-wide text-amber-300 md:text-xl lg:text-2xl'>
                            {String(rest).toUpperCase()}
                          </p>

                          {/* Quick Level Jump */}
                          <div className='mx-auto mt-3 flex flex-wrap items-center justify-center gap-2'>
                            {Object.keys(levels).map((level, i, arr) => (
                              <React.Fragment key={level}>
                                <button
                                  type='button'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLevelScroll(`${accredTitle}-${level}`);
                                  }}
                                  className='rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 cursor-pointer'
                                >
                                  {String(level).toUpperCase()}
                                </button>
                                {i !== arr.length - 1 && <span className='text-white/70'>•</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* PERIOD ACTIONS — bottom-right */}
                      <div className='absolute right-3 bottom-3 z-20 flex items-center gap-2'>
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            const [title, year] = formatAccreditationTitle(accredTitle, { isForDB: true });
                            handleClipboardClick({ title, year, accredBody });
                          }}
                          title='Add level and programs'
                          className='rounded-full bg-white p-2 text-slate-700 shadow hover:bg-white/95 active:scale-95 cursor-pointer'
                          aria-label='Add level and programs'
                        >
                          <ClipboardPlus size={20} />
                        </button>

                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionClick(e, { isFromAccredInfo: true, data: { accredInfoId: accredInfoUUID } });
                          }}
                          title='Options'
                          className='rounded-full bg-white p-2 text-slate-700 shadow hover:bg-white/95 active:scale-95 cursor-pointer'
                          aria-haspopup='menu'
                          aria-expanded={activeAccredInfoID === accredInfoUUID}
                        >
                          <EllipsisVertical size={20} />
                        </button>
                      </div>

                      {/* PERIOD DROPDOWN — high z-index, sits above programs */}
                      {activeAccredInfoID === accredInfoUUID && (
                        <div
                          ref={accredInfoOptionsRef}
                          className='absolute right-55 bottom-0 z-[60]'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Dropdown width='h-auto w-56' border='border border-slate-200 rounded-md bg-white shadow-lg'>
                            {accredInfoOptions.map((option, i) => (
                              <React.Fragment key={i}>
                                {option.label === 'Delete' && <hr className='my-1 text-slate-200' />}
                                <div
                                  role='menuitem'
                                  tabIndex={0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOptionItemClick(e, {
                                      isFromAccredInfo: true,
                                      optionName: option.label,
                                      accredInfo: {
                                        title: firstProgram.accred_title,
                                        year: accredYear,
                                        accredBody
                                      }
                                    });
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      handleOptionItemClick(e, {
                                        isFromAccredInfo: true,
                                        optionName: option.label,
                                        accredInfo: {
                                          title: firstProgram.accred_title,
                                          year: accredYear,
                                          accredBody
                                        }
                                      });
                                    }
                                  }}
                                  className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-slate-50 ${
                                    option.label === 'Delete' ? 'text-red-600' : 'text-slate-700'
                                  }`}
                                >
                                  <i>{option.icon}</i>
                                  <span>{option.label}</span>
                                </div>
                              </React.Fragment>
                            ))}
                          </Dropdown>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Levels and Program Cards */}
                <section className='mx-auto max-w-7xl px-4'>
                  {Object.entries(levels).map(([level, programs]) => (
                    <React.Fragment key={level}>
                      {/* Tight spacing to pull cards closer */}
                      <div className='mx-auto my-6 w-full text-center'>
                        <p className='text-lg font-extrabold tracking-wide text-emerald-800 md:text-xl'>
                          {level === LEVEL.PRELIM ? 'Programs Under Survey' : 'Programs To Be Accredited'}
                        </p>
                      </div>

                      <div
                        ref={(el) => (levelRef.current[`${accredTitle}-${level}`] = el)}
                        id={`${accredTitle}-${level}`}
                        className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'
                      >
                        {/* Level chip */}
                        <div className='mx-auto mb-4 flex w-full items-center justify-center'>
                          <div className='inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-800'>
                            {String(level).toUpperCase()}
                          </div>
                        </div>

                        <div className='relative flex flex-wrap justify-center gap-5'>
                          {programs.map((programObj, id) => {
                            const programId = `${accredTitle}-${level}-${programObj.program_uuid}`;
                            const programUUID = programObj?.program_uuid;
                            const program = programObj?.program;

                            return (
                              <div
                                key={programUUID}
                                ref={programCardRef}
                                id={`last-program-${programId}`}
                                onClick={(e) =>
                                  handleProgramCardClick(e, {
                                    data: {
                                      accredTitle,
                                      level,
                                      accredInfoUUID,
                                      programUUID,
                                      program,
                                      programId
                                    }
                                  })
                                }
                                className='relative w-full max-w-[420px] cursor-pointer overflow-visible rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md'
                              >
                                {/* PIT-themed banner */}
                                <div id={`${accredBody}-${accredYear}-${level}-${program}`} className='z-10'>
                                  <div className='relative overflow-hidden rounded-lg bg-emerald-700 py-7 ring-1 ring-emerald-900/10'>
                                    <img
                                      src={toga}
                                      alt='Toga Icon'
                                      loading='lazy'
                                      className='pointer-events-none absolute right-2 top-2 h-20 w-20 opacity-10'
                                    />
                                    <p className='relative z-10 text-center text-lg font-bold text-white'>{program}</p>
                                  </div>
                                </div>

                                {/* Program dropdown (anchored) */}
                                {activeProgramID === programId && (
                                  <div ref={programOptionsRef} className='absolute right-2 top-10 z-30'>
                                    <Dropdown
                                      key={id}
                                      width='h-auto w-56'
                                      border='border border-slate-200 rounded-md bg-white shadow-lg'
                                    >
                                      {programOptions.map((option, index) => (
                                        <React.Fragment key={index}>
                                          {option.label === 'Delete' && <hr className='my-1 text-slate-2 00' />}
                                          <div
                                            onClick={(e) =>
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
                                              })
                                            }
                                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer ${
                                              option.label === 'Delete' ? 'text-red-600' : 'text-slate-700'
                                            }`}
                                          >
                                            <i>{option.icon}</i>
                                            <span>{option.label}</span>
                                          </div>
                                        </React.Fragment>
                                      ))}
                                    </Dropdown>
                                  </div>
                                )}

                                {/* Options trigger */}
                                <button
                                  onClick={(e) =>
                                    handleOptionClick(e, {
                                      isFromProgram: true,
                                      data: { accredTitle: firstProgram.accred_title, level, programId }
                                    })
                                  }
                                  title='Options'
                                  className={`absolute right-2 top-2 z-20 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer ${
                                    activeProgramID === programId ? 'ring-2 ring-emerald-200' : ''
                                  }`}
                                >
                                  <EllipsisVertical size={18} />
                                </button>

                                {/* Integrated progress */}
                                <div className='mt-3'>
                                  {progressData?.map((item, index) => {
                                    if (item.ilpm_id !== programObj.ilpmId) return null;
                                    const progress = Number(item.progress || 0).toFixed(1);
                                    const { status, color } = getProgressStyle(progress);

                                    return (
                                      <div key={index} className='rounded-lg border border-slate-200 bg-white p-3'>
                                        <div className='mb-1.5 flex items-center justify-between'>
                                          <span className='text-xs font-semibold text-slate-700'>Progress</span>
                                          <span className='text-xs font-semibold text-slate-700'>{progress}%</span>
                                        </div>
                                        <ProgressBar progress={progress} status={status} color={color} compact />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}

                          {/* Add program card */}
                          <div
                            onClick={() =>
                              handleAddClick({
                                isFromCard: true,
                                data: { accredTitle: firstProgram.accred_title, accredYear, accredBody, level }
                              })
                            }
                            title='Click to add program'
                            className='flex w-full max-w-[420px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-7 text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50 active:scale-95'
                          >
                            <div className='rounded-full bg-white p-3 ring-1 ring-emerald-200'>
                              <div className='h-5 w-5 bg-[linear-gradient(#059669,#059669),linear-gradient(#059669,#059669)] [background-size:2px_100%,100%_2px] [background-position:center,center] [background-repeat:no-repeat]' />
                            </div>
                            <p className='text-sm font-medium'>Add Programs</p>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </section>

                {/* Divider */}
                {index !== Object.entries(grouped).length - 1 && (
                  <div className='mx-auto my-10 max-w-7xl px-4'>
                    <hr className='border-t border-dashed border-slate-300' />
                  </div>
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
          handleInfoHover
        }}
      />
    </DeanLayout>
  );
};

export default ProgramsToAccredit;
