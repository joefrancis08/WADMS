import React from 'react';
import { toga } from '../../assets/icons';
import { Scroll } from 'lucide-react';

const ProgramsTab = ({
  states = {},
  refs = {},
  datas = {},
  helpers = {},
  handlers = {},
}) => {
  const { loading, error } = states;
  const { scrollContainerRef, levelRef } = refs;
  const { dataPrograms = [] } = datas;
  const { formatAccreditationTitleForUI = () => {} } = helpers;
  const { handleProgramCardClick = () => {}, handleLevelScroll = () => {} } =
    handlers;

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <Scroll className='text-emerald-500 h-28 w-28 animate-spin' />
        <p className='text-slate-600 text-lg font-medium mt-3'>
          Loading programs…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <Scroll className='text-red-500 h-28 w-28' />
        <p className='text-red-600 text-lg font-medium mt-3'>
          Couldn’t load programs. Please try again.
        </p>
      </div>
    );
  }

  if (!loading && dataPrograms.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <Scroll className='text-slate-400 h-28 w-28' />
        <p className='text-slate-500 text-lg mt-3'>No programs available.</p>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl px-4 space-y-20'>
      {dataPrograms.map((accred, index) => {
        const [first, rest] = formatAccreditationTitleForUI(accred.accredTitle);

        return (
          <React.Fragment key={`${accred.accredTitle}-${index}`}>
            {/* ===== Banner Section ===== */}
            <div
              ref={scrollContainerRef}
              className='relative w-full h-[26rem] rounded-xl overflow-hidden shadow-md border border-slate-200 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500'
            >
              {/* Overlay */}
              <div className='absolute inset-0 bg-emerald-800/30 backdrop-blur-[1px]' />

              {/* Logos */}
              <div className='absolute flex top-4 left-4 gap-3'>
                <img
                  src='/pit-logo-outlined.png'
                  alt='PIT Logo'
                  className='h-12 w-auto drop-shadow-md'
                />
                <img
                  src='/cgs-logo.png'
                  alt='CGS Logo'
                  className='h-12 w-auto drop-shadow-md'
                />
              </div>

              {/* Title */}
              <div className='relative z-10 flex flex-col items-center justify-center h-full text-center'>
                <h1 className='text-5xl md:text-6xl font-extrabold text-white tracking-wider'>
                  {String(first).toUpperCase()}
                </h1>
                <p className='text-emerald-50 text-2xl md:text-3xl mt-1 font-semibold'>
                  {String(rest).toUpperCase()}
                </p>
                <hr className='w-40 border-t-4 border-yellow-400 my-5' />
                <div className='flex flex-wrap justify-center gap-2 text-white text-sm font-medium'>
                  {Object.entries(accred.levels || {}).map(([level], idx) => (
                    <span
                      key={level}
                      onClick={() =>
                        handleLevelScroll(`${accred.accredTitle}-${level}`)
                      }
                      className='cursor-pointer bg-white/15 px-3 py-1 rounded-full hover:bg-white/25 transition'
                    >
                      {String(level).toUpperCase()}
                      {idx < Object.keys(accred.levels).length - 1 && (
                        <span className='mx-1 text-yellow-300'>•</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== Level Sections ===== */}
            <div className='space-y-16'>
              {Object.entries(accred.levels || {}).map(([level, programs]) => (
                <div
                  key={level}
                  ref={(el) =>
                    (levelRef.current[`${accred.accredTitle}-${level}`] = el)
                  }
                  id={`${accred.accredTitle}-${level}`}
                  className='bg-white border border-slate-200 shadow-sm rounded-xl p-8'
                >
                  {/* Level Header */}
                  <div className='text-center mb-8'>
                    <h2 className='text-2xl md:text-3xl font-bold text-emerald-700 mb-2'>
                      {level === 'Preliminary'
                        ? 'Programs Under Survey'
                        : 'Programs To Be Accredited'}
                    </h2>
                    <hr className='w-48 mx-auto border-t-2 border-emerald-500' />
                  </div>

                  {/* Program Cards */}
                  <div className='flex flex-wrap justify-center gap-8'>
                    {(programs || []).length === 0 ? (
                      <div className='flex flex-col items-center justify-center py-10'>
                        <Scroll className='text-slate-400 h-20 w-20' />
                        <p className='text-slate-500 mt-2 text-sm'>
                          No programs found for this level.
                        </p>
                      </div>
                    ) : (
                      (programs || []).map((p) => (
                        <div
                          onClick={() =>
                            handleProgramCardClick(
                              p.accred_uuid,
                              level,
                              p.program_uuid
                            )
                          }
                          key={p.program_uuid}
                          className='relative flex items-center justify-center h-56 w-72 cursor-pointer rounded-xl border border-slate-200 bg-gradient-to-b from-emerald-600 to-emerald-400 shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform'
                        >
                          <div className='relative flex items-center justify-center text-center'>
                            <img
                              src={toga}
                              alt='Toga Icon'
                              className='absolute opacity-10 h-40 w-40'
                            />
                            <p className='relative z-10 text-xl md:text-2xl font-semibold text-white tracking-wide'>
                              {p.program}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider Between Accreditations */}
            {index !== dataPrograms.length - 1 && (
              <hr className='w-[90%] border-t-4 border-emerald-200 my-16 mx-auto' />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgramsTab;
