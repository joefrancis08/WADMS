import React from 'react';
import { toga } from '../../assets/icons';
import { Scroll } from 'lucide-react';

const ProgramsTab = ({ states = {}, refs = {}, datas = {}, helpers = {}, handlers = {} }) => {
  const { loading, error } = states;
  const { scrollContainerRef, levelRef } = refs;
  const { dataPrograms = [] } = datas;
  const { 
    formatAccreditationTitleForUI = () => {} 
  } = helpers;
  const {
    handleProgramCardClick = () => {}, 
    handleLevelScroll = () => {}
  } = handlers;
  return (
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
        </div>
      )}
      {console.log(dataPrograms)}
      {/* Data */}
      {!loading && !error && dataPrograms.length > 0 && (
        dataPrograms.map((accred, index) => {
          const [first, rest] = formatAccreditationTitleForUI(accred.accredTitle);

          const firstLevelKey = Object.keys(accred.levels || {})[0];
          const firstProgram = accred.levels?.[firstLevelKey]?.[0];

          console.log(accred);

          return (
            <React.Fragment key={`${accred.accredTitle}-${index}`}>
              <div
                ref={scrollContainerRef}
                className="relative border rounded-lg flex flex-col bg-slate-900 pb-15 p-4 shadow-lg overflow-auto border-slate-700"
              >
                {/* Banner */}
                <div
                  id={accred.accredTitle}
                  className='relative w-full h-100 bg-[url("/pit-bg-6.jpg")] bg-cover bg-center rounded-lg'
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
                    {console.log(programs)}
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
                              onClick={() => handleProgramCardClick(p.accred_uuid, level, p.program_uuid)}
                              key={p.id ?? `${accred.accredTitle}-${level}-${p.program}`}
                              className='relative flex items-center mb-5 justify-center h-100 p-8 shadow-lg border border-slate-600 hover:shadow-slate-600 transition w-100 bg-gradient-to-b from-green-700 to-amber-300 rounded-lg cursor-pointer active:scale-98'
                            >
                              {console.log(p.accred_uuid)}
                              <div className='relative flex items-center justify-center'>
                                <img src={toga} alt='Toga Icon' loading='lazy' className='opacity-10 h-40 w-40' />
                                <p className='absolute top-1/2 left-1/2 -translate-1/2 text-center text-3xl md:text-4xl tracking-wide text-white font-bold z-30'>
                                  {p.program}
                                  {console.log(p.program_uuid)}
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
  );
};

export default ProgramsTab;
