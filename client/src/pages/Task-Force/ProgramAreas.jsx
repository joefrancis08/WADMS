import React, { useState, useMemo } from 'react';
import { FolderOpen, LoaderCircle, Search } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import ProfileStack from '../../components/ProfileStack';
import TaskForceLayout from '../../components/Layout/Task-Force/TaskForceLayout';
import useProgramAreas from '../../hooks/Task Force/useProgramAreas';
import PATH from '../../constants/path';

const ProgramAreasDummy = () => {
  const { navigate, refs, params, states, datas, helpers, handlers } = useProgramAreas();
  const { loading, error } = states;
  const { 
    title, year, accredBody, level,
    program, areas
  } = datas;
  const { handleAreaCardClick } = handlers;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeAreaId, setActiveAreaId] = useState(null);

  const filteredAreas = useMemo(() => {
    if (!searchQuery) return areas
    const q = searchQuery.toLowerCase()
    return areas.filter((a) => a.area.toLowerCase().includes(q))
  }, [searchQuery, areas]);

  const breadcrumbItems = [
    { 
      label: `${title} ${year}`, 
      onClick: () => {
        navigate(PATH.TASK_FORCE.ACCREDITATION);
      } 
    },
    { 
      label: program, 
      onClick: () => {
        navigate(PATH.TASK_FORCE.ACCREDITATION);
      } 
    },
    { label: 'Areas', isActive: true },
  ];

  return (
    <TaskForceLayout>
      <div className='flex-1 p-3'>
        <div className='bg-slate-900 m-2 pb-2 border border-slate-700 rounded-lg'>
          {/* Header Section */}
          <div className='sticky top-0 z-40 flex flex-col md:flex-row md:items-center md:justify-between shadow px-4 pt-4 bg-slate-900 p-4 rounded-t-lg gap-4 border-b border-slate-700'>
            <Breadcrumb items={breadcrumbItems} />
            <div className='relative flex items-center gap-x-2 w-full md:w-120'>
              <Search className='absolute left-3 top-2.5 h-5 w-5 text-slate-400' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search area...'
                className='pl-10 pr-3 py-2 rounded-full bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 w-full transition-all'
              />
            </div>
          </div>

          {/* Program + Level display */}
          <div className='flex items-center justify-center mt-4 max-md:mt-10 w-[85%] md:w-[75%] lg:w-[50%] mx-auto'>
            <p className='relative text-center mb-8'>
              <span className='text-yellow-400 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide text-center'>
                {program}
              </span>
              <span className='absolute -bottom-5 right-1/2 translate-x-1/2 text-xs md:text-sm px-6 text-slate-200'>
                {level}
              </span>
            </p>
          </div>

          {/* Areas */}
          <div className={`flex flex-wrap gap-10 justify-center mb-8 py-8 px-2 mx-2 rounded ${filteredAreas.length ? 'items-start' : 'items-center'}`}>
            {!filteredAreas.length && (
              <div className='flex flex-col items-center justify-center'>
                <FolderOpen className='text-slate-600' size={200} />
                <p className='text-lg text-slate-100'>No areas found.</p>
              </div>
            )}

            {!loading ? (
              filteredAreas.map((areaData) => (
                <div
                  key={areaData.area_uuid}
                  onClick={() => handleAreaCardClick(areaData.area_uuid)}
                  className='relative flex flex-col items-start justify-center px-2 max-sm:w-full md:w-75 lg:w-50 h-60 bg-[url("/cgs-bg-2.png")] bg-cover bg-center shadow-slate-800 border border-slate-600 hover:shadow-md transition cursor-pointer active:shadow'
                >
                  <div className='absolute inset-0 bg-black/50'></div>
                  {activeAreaId === areaData.area_uuid && <div className='absolute inset-0 z-20 bg-black/30'></div>}

                  <div className='flex flex-col text-center z-20 w-full'>
                    <p className='text-md font-bold text-white bg-yellow-400 py-1 px-2 w-30 shadow-md absolute top-10 left-1/2 -translate-x-1/2'>
                      {areaData.area.split(':')[0]}
                    </p>
                    <p className='text-xl mt-12 text-white font-semibold px-4'>
                      {areaData.area.split(':')[1]}
                    </p>
                  </div>

                  {/* <button
                    title='Upload document'
                    className='absolute bottom-2.5 right-2 text-white cursor-pointer active:opacity-50 rounded-full hover:bg-white/20 p-1'
                  >
                    <Upload />
                  </button> */}

                  <div className='absolute bottom-2.5 left-1 z-20'>
                    <ProfileStack data={{ dummy: true }} />
                  </div>
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center'>
                <div className='flex flex-col items-center text-center z-20 w-full'>
                  <LoaderCircle className='text-slate-100 animate-spin' size={32}/>
                  <p className='text-slate-300 text-sm'>Loading areas...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TaskForceLayout>
  );
};

export default ProgramAreasDummy;