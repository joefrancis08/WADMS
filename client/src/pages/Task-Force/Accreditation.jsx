import React from 'react';
import TaskForceLayout from '../../components/Layout/Task-Force/TaskForceLayout';
import {
  Search,
  RefreshCw,
} from 'lucide-react';
import useAccreditation from '../../hooks/Task Force/useAccreditation';
import AssignmentTab from '../../components/Task Force/AssignmentTab';
import ProgramsTab from '../../components/Task Force/ProgramsTab';

export default function Accreditation() {
  const { refs, states, datas, helpers, handlers } = useAccreditation();

  const { searchInputRef, scrollContainerRef, levelRef, docOptionRef } = refs;

  const {
    setQuery,
    activeParamId,
    activeSubparamId,
    activeIndicatorId,
    loading,
    error,
    activeDocId,
  } = states;

  const {
    user,
    items,
    activeItemId,
    query,
    dataPrograms,
    groupedAssignments,
    selectedFiles,
    uploaderDocs,
    loadingUploaderDocuments,
    errorUploaderDocuments,
  } = datas;

  const { formatAccreditationTitleForUI } = helpers;

  const {
    handleProgramCardClick,
    handleItemClick,
    handleLevelScroll,
    handleDropdownClick,
    handleUploadClick,
    handleFileChange,
    handleDocOptionClick,
    handleDelete,
  } = handlers;

  return (
    <TaskForceLayout>
      <div className='flex-1 bg-slate-50'>
        {/* ===== Sticky Header ===== */}
        <div className='sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur'>
          <div className='mx-auto flex max-w-7xl flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between'>
            <h2 className='text-2xl font-bold text-emerald-700'>Accreditation</h2>

            {/* Tabs (Desktop) */}
            <div
              role='tablist'
              aria-label='Accreditation sections'
              className='hidden md:flex items-center gap-x-2'
            >
              <div className='flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 p-1'>
                {items.map((item) => {
                  const isActive = activeItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      role='tab'
                      aria-selected={isActive}
                      onClick={() => handleItemClick(item)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tabs (Mobile) */}
            <div
              role='tablist'
              aria-label='Accreditation sections'
              className='md:hidden max-w-[60vw] overflow-x-auto scrollbar-hide -mx-1 px-1'
            >
              <div className='flex items-center gap-2'>
                {items.map((item) => {
                  const isActive = activeItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      role='tab'
                      aria-selected={isActive}
                      onClick={() => handleItemClick(item)}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className='relative w-full md:w-80'>
              <Search className='pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400' />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search title, year, level, program…'
                aria-label='Search accreditation'
                className='w-full pl-10 pr-9 py-2 rounded-full border border-slate-300 bg-white text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 transition'
              />
              {!!query && (
                <button
                  type='button'
                  onClick={() => setQuery('')}
                  className='absolute right-3 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-emerald-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400'
                  aria-label='Clear search'
                  title='Clear'
                >
                  <svg
                    viewBox='0 0 24 24'
                    className='h-4 w-4'
                    fill='currentColor'
                  >
                    <path d='M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 1 0-1.41 1.42L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.42L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z' />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===== Main Content ===== */}
        <div className='mx-auto max-w-7xl p-4'>
          {activeItemId === 'programs' && (
            <ProgramsTab
              refs={{ scrollContainerRef, levelRef }}
              states={{ loading, error }}
              datas={{ dataPrograms }}
              helpers={{ formatAccreditationTitleForUI }}
              handlers={{ handleLevelScroll, handleProgramCardClick }}
            />
          )}

          {activeItemId === 'assignments' && (
            <AssignmentTab
              refs={{ docOptionRef }}
              states={{
                activeParamId,
                activeSubparamId,
                activeIndicatorId,
                activeDocId,
                loadingUploaderDocuments,
              }}
              data={{
                groupedAssignments,
                selectedFiles,
                uploaderDocs,
                user
              }}
              handlers={{
                handleDropdownClick,
                handleUploadClick,
                handleFileChange,
                handleDocOptionClick,
                handleDelete,
              }}
            />
          )}
        </div>
      </div>
    </TaskForceLayout>
  );
}
