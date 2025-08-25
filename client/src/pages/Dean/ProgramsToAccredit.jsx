import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { BookPlus, ClipboardList, EllipsisVertical, Link2, NotepadText, UserRoundPlus } from 'lucide-react';
import SearchComponent from '../../components/SearchComponent';
import { useState } from 'react';
import ContentHeader from '../../components/Dean/ContentHeader';

const ProgramsToAccredit = () => {

  const [searchClick, setSearchClick] = useState(false);
  const [hoverProgramOptions, setHoverProgramOptions] = useState(false);

  const handleSearchClick = () => {
    setSearchClick(!searchClick);
  }
  const dummyData = {
    programName: 'PhD-TM'
  };

  return (
    <AdminLayout>
      <div className='flex-1 space-y-3'>
        {/* Header */}
        <ContentHeader 
          headerIcon={NotepadText}
          headerTitle='Programs Under Accreditation'
          searchClick={searchClick}
          placeholder='Search program...'
          condition={true}
        />
        <div className='relative px-4 flex justify-end'>
          <div className='flex items-center'>
            <button title='Add Program to Accredit' onClick={''} className='p-3 rounded-full mr-2 cursor-pointer transition-all shadow bg-slate-300 hover:opacity-80 active:opacity-50'>
              <BookPlus className='text-slate-700' size={28}/>
            </button>
          </div>
        </div>
        <div className='relative bg-slate-300 p-4 mx-4 mb-4 mt-6'>
          <div className='absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center w-1/2 lg:w-1/3 p-2 bg-gradient-to-l from-slate-900 via-green-600 to-slate-900 shadow-md max-lg:text-center text-white rounded font-bold'>
            <p className='max-sm:text-sm md:text-md lg:text-lg text-center'>
              2025-2026
            </p>
          </div>
          <div className='flex justify-center px-4 py-4 mt-4'>
          </div>
          <div className='relative p-4 space-y-6 mb-4 border bg-slate-200 shadow-md border-slate-300 rounded-md mx-4'>
            <h2 className={`absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-[80%] md:w-[70%] lg:w-1/2 p-2 text-2xl bg-gradient-to-l from-green-700 via-yellow-400 to-green-700 shadow-md max-lg:text-center text-white rounded font-bold`}>
              Level II
            </h2>
            <div className='relative flex flex-wrap gap-10 justify-center pb-4 pt-8'>
              <div
                onMouseEnter={() => setHoverProgramOptions(true)}
                onMouseLeave={() => setHoverProgramOptions(false)}
                className={`relative flex items-center justify-center h-60 p-4 bg-gradient-to-b from-green-700 to-amber-300 rounded-xl border border-slate-300 shadow hover:shadow-md cursor-pointer transition-all w-full sm:w-65 md:w-70 lg:w-75 xl:w-80`}
              >
                <p className='bg-gradient-to-b from-yellow-300 to-amber-400 w-full text-2xl text-white text-center shadow font-bold mt-3 p-4'>
                  Master of Management
                </p>

                {hoverProgramOptions && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-black/10 backdrop-blur-xs z-10"></div>
                    <div className='flex items-center justify-center px-6 py-4 gap-x-4 bg-white absolute z-20'>
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                    </div>
                  </>
                )}
              </div>
              <div
                onMouseEnter={() => setHoverProgramOptions(true)}
                onMouseLeave={() => setHoverProgramOptions(false)}
                className={`relative flex items-center justify-center h-60 p-4 bg-gradient-to-b from-green-700 to-amber-300 rounded-xl border border-slate-300 shadow hover:shadow-md cursor-pointer transition-all w-full sm:w-65 md:w-70 lg:w-75 xl:w-80`}
              >
                <p className='bg-gradient-to-b from-yellow-300 to-amber-400 w-full text-2xl text-white text-center shadow font-bold mt-3 p-4'>
                  Master of Management
                </p>

                {hoverProgramOptions && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-black/10 backdrop-blur-xs z-10"></div>
                    <div className='flex items-center justify-center px-6 py-4 gap-x-4 bg-white absolute z-20'>
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                    </div>
                  </>
                )}
              </div>
              <div
                onMouseEnter={() => setHoverProgramOptions(true)}
                onMouseLeave={() => setHoverProgramOptions(false)}
                className={`relative flex items-center justify-center h-60 p-4 bg-gradient-to-b from-green-700 to-amber-300 rounded-xl border border-slate-300 shadow hover:shadow-md cursor-pointer transition-all w-full sm:w-65 md:w-70 lg:w-75 xl:w-80`}
              >
                <p className='bg-gradient-to-b from-yellow-300 to-amber-400 w-full text-2xl text-white text-center shadow font-bold mt-3 p-4'>
                  Master of Management
                </p>

                {hoverProgramOptions && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-black/10 backdrop-blur-xs z-10"></div>
                    <div className='flex items-center justify-center px-6 py-4 gap-x-4 bg-white absolute z-20'>
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                    </div>
                  </>
                )}
              </div>
              <div
                onMouseEnter={() => setHoverProgramOptions(true)}
                onMouseLeave={() => setHoverProgramOptions(false)}
                className={`relative flex items-center justify-center h-60 p-4 bg-gradient-to-b from-green-700 to-amber-300 rounded-xl border border-slate-300 shadow hover:shadow-md cursor-pointer transition-all w-full sm:w-65 md:w-70 lg:w-75 xl:w-80`}
              >
                <p className='bg-gradient-to-b from-yellow-300 to-amber-400 w-full text-2xl text-white text-center shadow font-bold mt-3 p-4'>
                  Master of Management
                </p>

                {hoverProgramOptions && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-black/10 backdrop-blur-xs z-10"></div>
                    <div className='flex items-center justify-center px-6 py-4 gap-x-4 bg-white absolute z-20'>
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                    </div>
                  </>
                )}
              </div>
              <div
                onMouseEnter={() => setHoverProgramOptions(true)}
                onMouseLeave={() => setHoverProgramOptions(false)}
                className={`relative flex items-center justify-center h-60 p-4 bg-gradient-to-b from-green-700 to-amber-300 rounded-xl border border-slate-300 shadow hover:shadow-md cursor-pointer transition-all w-full sm:w-65 md:w-70 lg:w-75 xl:w-80`}
              >
                <p className='bg-gradient-to-b from-yellow-300 to-amber-400 w-full text-2xl text-white text-center shadow font-bold mt-3 p-4'>
                  Master of Management
                </p>

                {hoverProgramOptions && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-black/10 backdrop-blur-xs z-10"></div>
                    <div className='flex items-center justify-center px-6 py-4 gap-x-4 bg-white absolute z-20'>
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                    </div>
                  </>
                )}
              </div>
              <div
                onMouseEnter={() => setHoverProgramOptions(true)}
                onMouseLeave={() => setHoverProgramOptions(false)}
                className={`relative flex items-center justify-center h-60 p-4 bg-gradient-to-b from-green-700 to-amber-300 rounded-xl border border-slate-300 shadow hover:shadow-md cursor-pointer transition-all w-full sm:w-65 md:w-70 lg:w-75 xl:w-80`}
              >
                <p className='bg-gradient-to-b from-yellow-300 to-amber-400 w-full text-2xl text-white text-center shadow font-bold mt-3 p-4'>
                  Master of Management
                </p>

                {hoverProgramOptions && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-black/10 backdrop-blur-xs"></div>
                    <div className='flex items-center justify-center px-6 py-4 gap-x-4 bg-white absolute'>
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                      <BookPlus />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProgramsToAccredit;
