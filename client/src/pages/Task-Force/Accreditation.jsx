import React from 'react';
import TaskForceLayout from '../../components/Layout/Task-Force/TaskForceLayout';
import { ChevronDown, Folder, FolderOpen, Scroll, Search } from 'lucide-react';
import { toga } from '../../assets/icons';
import useAccreditation from '../../hooks/Task Force/useAccreditation';

export default function Accreditation() {
  const { refs, states, datas, helpers, handlers } = useAccreditation();

  const { searchInputRef, scrollContainerRef, levelRef } = refs;

  const {
    setQuery,
    showParameters,
    showSubParam,
    showIndicator,
    loading,
    error,
  } = states;

  const {
    items,
    activeItemId,
    query,
    dataPrograms,       // [{ accredTitle, levels }]
    groupedPrograms,    // object: { [accredTitle]: { [level]: Program[] } }
    dummyPrograms,      // optional fallback
    groupedAssignments,
  } = datas;

  console.log(groupedPrograms);

  const { formatAccreditationTitleForUI } = helpers;

  const {
    handleItemClick,
    handleLevelScroll,
    handleDropdownClick,
  } = handlers;

  return (
    <TaskForceLayout>
      <div className="flex-1 m-1">
        {/* Header */}
        <div className="sticky top-0 z-40 mb-8 bg-slate-900/95 backdrop-blur border-b border-slate-700">
          <div className="flex items-center justify-between py-2 px-4">
            <h2 className="text-2xl text-slate-100 font-bold">Accreditation</h2>

            <div className="flex items-center gap-x-4">
              {/* Tabs (desktop) */}
              <div
                role="tablist"
                aria-label="Accreditation sections"
                className="hidden md:flex items-center gap-x-2 pr-2"
              >
                <div className="flex items-center gap-2 rounded-full bg-slate-800/60 p-1 border border-slate-700">
                  {items.map((item) => {
                    const isActive = activeItemId === item.id;
                    return (
                      <button
                        key={item.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleItemClick(item)}
                        className={[
                          "px-4 py-1.5 rounded-full text-sm font-medium transition",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
                          isActive
                            ? "bg-yellow-400 text-slate-900 shadow-sm"
                            : "text-slate-200 hover:text-white hover:bg-slate-700/80"
                        ].join(" ")}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tabs (mobile) */}
              <div
                role="tablist"
                aria-label="Accreditation sections"
                className="md:hidden max-w-[60vw] overflow-x-auto scrollbar-hide -mx-1 px-1"
              >
                <div className="flex items-center gap-2">
                  {items.map((item) => {
                    const isActive = activeItemId === item.id;
                    return (
                      <button
                        key={item.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleItemClick(item)}
                        className={[
                          "whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition border",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
                          isActive
                            ? "bg-yellow-400 text-slate-900 border-yellow-300 shadow"
                            : "bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700"
                        ].join(" ")}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search */}
              <div className="relative w-80 hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title, year, level, program…"
                  aria-label="Search accreditation"
                  className="w-full pl-10 pr-9 py-2 rounded-full bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                {!!query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Clear search"
                    title="Clear"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 1 0-1.41 1.42L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.42L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div>
          {/* ------------------ PROGRAMS TAB ------------------ */}
          {activeItemId === 'programs' && (
            <div>
              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Scroll className="text-slate-400 h-40 w-40 animate-pulse" />
                  <p className="text-slate-200 text-xl font-medium mt-4">Loading programs…</p>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Scroll className="text-red-400 h-40 w-40" />
                  <p className="text-red-300 text-lg font-medium mt-4">
                    Couldn’t load programs. Please try again.
                  </p>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && dataPrograms.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Scroll className="text-slate-400 h-40 w-40" />
                  <p className="text-slate-200 text-xl font-medium mt-4">
                    {dummyPrograms.length === 0 && !query
                      ? 'No accreditation data available.'
                      : `No results for “${query}”.`}
                  </p>
                </div>
              )}

              {/* Data */}
              {!loading && !error && dataPrograms.length > 0 && (
                dataPrograms.map((accred, index) => {
                  const [first, rest] = formatAccreditationTitleForUI(accred.accredTitle);

                  const firstLevelKey = Object.keys(accred.levels || {})[0];
                  const firstProgram = accred.levels?.[firstLevelKey]?.[0];

                  return (
                    <React.Fragment key={`${accred.accredTitle}-${index}`}>
                      <div
                        ref={scrollContainerRef}
                        className="relative border rounded-lg flex flex-col bg-slate-900 pb-15 p-4 shadow-lg overflow-auto border-slate-700"
                      >
                        {/* Banner */}
                        <div
                          id={accred.accredTitle}
                          className='relative w-full h-100 bg-[url("/pit-bg.jpg")] bg-cover bg-center rounded-lg'
                        >
                          <div className='absolute inset-0 bg-black/70 rounded-lg border border-slate-700 shadow shadow-slate-800' />
                          {/* Logos */}
                          <div className='absolute flex top-2 right-2'>
                            <img src='/cgs-logo.png' alt='CGS Logo' loading='lazy' className='h-12 md:h-14 lg:h-16 w-auto' />
                          </div>
                          <div className='absolute flex top-2 left-2'>
                            <img src='/pit-logo-outlined.png' alt='' loading='lazy' className='h-12 md:h-14 lg:h-16 w-auto' />
                          </div>
                          {/* Title */}
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
                            {/* Levels quick jump */}
                            <p>
                              <span className='text-white text-md md:text-lg lg:text-xl font-bold'>
                                {Object.entries(accred.levels || {}).map(([level], idx, arr) => (
                                  <React.Fragment key={level}>
                                    <span
                                      onClick={() => handleLevelScroll(`${accred.accredTitle}-${level}`)}
                                      className='hover:underline cursor-pointer tracking-wider'
                                    >
                                      {String(level).toUpperCase()}
                                    </span>
                                    {idx !== arr.length - 1 && <span>{'\n'}&#8226;{'\n'}</span>}
                                  </React.Fragment>
                                ))}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Levels */}
                        {Object.entries(accred.levels || {}).map(([level, programs]) => (
                          <React.Fragment key={level}>
                            <hr className='w-[75%] bg-slate-600 border border-transparent my-16 mx-auto' />
                            <div className='mx-auto'>
                              <p className='text-xl md:text-2xl lg:text-3xl text-center tracking-wider font-extrabold text-yellow-400 mb-4'>
                                {level === 'Preliminary' ? 'Programs Under Survey' : 'Programs To Be Accredited'}
                              </p>
                            </div>

                            <div
                              ref={(el) => (levelRef.current[`${accred.accredTitle}-${level}`] = el)}
                              id={`${accred.accredTitle}-${level}`}
                              className='relative p-4 space-y-6 mb-4 bg-slate-800 border border-slate-700 rounded-lg'
                            >
                              <h2 className='absolute top-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-[60%] md:w-[50%] lg:w-[40%] p-2 text-lg md:text-xl lg:text-2xl text-slate-100 rounded font-extrabold tracking-wide'>
                                {String(level).toUpperCase()}
                              </h2>
                              <hr className='w-[50%] bg-green-500 border border-transparent mt-12 h-1 mx-auto' />

                              {/* Program cards */}
                              <div className='relative flex flex-wrap gap-10 justify-center pb-4 px-4'>
                                {(programs || []).length === 0 ? (
                                  <div className='flex flex-col items-center justify-center py-10'>
                                    <Scroll className='text-slate-400 h-24 w-24' />
                                    <p className='text-slate-200 mt-2'>No programs match your search.</p>
                                  </div>
                                ) : (
                                  (programs || []).map((p) => (
                                    <div
                                      key={p.id ?? `${accred.accredTitle}-${level}-${p.program}`}
                                      className='relative flex items-center mb-5 justify-center h-100 p-8 shadow-lg border border-slate-600 hover:shadow-slate-600 transition w-100 bg-gradient-to-b from-green-700 to-amber-300 rounded-lg'
                                    >
                                      <div className='relative flex items-center justify-center'>
                                        <img src={toga} alt='Toga Icon' loading='lazy' className='opacity-10 h-40 w-40' />
                                        <p className='absolute top-1/2 left-1/2 -translate-1/2 text-center text-3xl md:text-4xl tracking-wide text-white font-bold z-30'>
                                          {p.program}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>

                      {index !== dataPrograms.length - 1 && (
                        <hr className='w-[90%] bg-green-600 border border-transparent h-3 my-20 mx-auto' />
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          )}

          {/* ------------------ ASSIGNMENTS TAB ------------------ */}
          {activeItemId === 'assignments' && (
            <div className='bg-slate-900 border-t border-slate-700 mt-2 mb-8 min-h-100 p-2'>
              {Object.keys(groupedAssignments || {}).length > 0 ? (
                Object.entries(groupedAssignments).map(([accredKey, levels]) => (
                  <div
                    key={accredKey}
                    className='flex flex-col items-center px-5 pb-5 pt-8 gap-y-6 md:px-15 md:pb-5 justify-evenly'
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
                        <h4 className='text-base md:text-lg lg:text-xl text-green-900 font-extrabold bg-slate-100 px-4 py-1 rounded-md'>
                          {levelKey}
                        </h4>

                        {/* Programs */}
                        {Object.values(programs || {}).map((program) => (
                          <div
                            key={program.program}
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
                              <div className='flex flex-col gap-4 w-full px-4'>
                                {(program.areas || []).map((area) => (
                                  <div
                                    key={area.area}
                                    className='border border-slate-700 rounded-lg p-4 bg-slate-800'
                                  >
                                    {/* Area row */}
                                    <div
                                      onClick={() => handleDropdownClick({ isShowParameter: true })}
                                      className='flex items-center gap-x-2 p-2 hover:bg-slate-700 rounded-lg cursor-pointer'
                                    >
                                      <FolderOpen className='text-yellow-500 fill-yellow-500' />
                                      <h5 className='text-base md:text-lg font-semibold text-slate-100'>
                                        {area.area}
                                      </h5>
                                      {(area.parameters || []).length > 0 && (
                                        <button
                                          onClick={() => handleDropdownClick({ isShowParameter: true })}
                                          className='ml-auto p-1 hover:bg-slate-700 rounded-full'
                                          title='Toggle parameters'
                                        >
                                          <ChevronDown
                                            className={`text-slate-100 transition ${showParameters ? 'rotate-180' : ''}`}
                                          />
                                        </button>
                                      )}
                                    </div>

                                    {/* Parameters */}
                                    {showParameters &&
                                      (area.parameters || []).map((param) => (
                                        <div key={param.parameter} className='ml-8'>
                                          <div
                                            onClick={() => handleDropdownClick({ isShowSubParam: true })}
                                            className='flex items-center gap-x-2 p-2 hover:bg-slate-700 rounded-lg cursor-pointer'
                                          >
                                            <Folder className='text-yellow-500 fill-yellow-500' />
                                            <p className='font-medium text-slate-200'>{param.parameter}</p>
                                            {(param.subParameters || []).length > 0 && (
                                              <button
                                                onClick={() => handleDropdownClick({ isShowSubParam: true })}
                                                className='ml-auto p-1 hover:bg-slate-700 rounded-full'
                                                title='Toggle sub-parameters'
                                              >
                                                <ChevronDown
                                                  className={`text-slate-100 transition ${showSubParam ? 'rotate-180' : ''}`}
                                                />
                                              </button>
                                            )}
                                          </div>

                                          {/* Sub-Parameters */}
                                          {showSubParam &&
                                            (param.subParameters || []).map((sub) => (
                                              <div key={sub.subParameter} className='ml-8'>
                                                <div
                                                  onClick={() => handleDropdownClick({ isShowIndicator: true })}
                                                  className='flex items-center gap-x-2 p-2 hover:bg-slate-700 rounded-lg cursor-pointer'
                                                >
                                                  <Folder className='text-yellow-500 fill-yellow-500' />
                                                  <p className='text-slate-200'>{sub.subParameter}</p>
                                                  {(sub.indicators || []).length > 0 && (
                                                    <button
                                                      onClick={() => handleDropdownClick({ isShowIndicator: true })}
                                                      className='ml-auto p-1 hover:bg-slate-700 rounded-full'
                                                      title='Toggle indicators'
                                                    >
                                                      <ChevronDown
                                                        className={`text-slate-100 transition ${showIndicator ? 'rotate-180' : ''}`}
                                                      />
                                                    </button>
                                                  )}
                                                </div>

                                                {/* Indicators */}
                                                {showIndicator &&
                                                  (sub.indicators || []).map((ind, idx) => (
                                                    <div key={`${sub.subParameter}-${idx}`} className='ml-8'>
                                                      <div className='flex items-center gap-x-2 p-2 hover:bg-slate-700 rounded-lg cursor-default'>
                                                        <Folder className='text-yellow-500 fill-yellow-500' />
                                                        <p className='text-slate-200'>{ind}</p>
                                                      </div>
                                                    </div>
                                                  ))}
                                              </div>
                                            ))}
                                        </div>
                                      ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
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
          )}
        </div>
      </div>
    </TaskForceLayout>
  );
}
