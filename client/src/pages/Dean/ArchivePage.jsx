import React, { useState } from 'react';
import { Search, FolderPlus, Archive } from 'lucide-react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';

const ArchivePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy archive data (you can replace with backend data later)
  const archives = [
    { id: 1, name: 'AACCUP Accreditation 2021' },
    { id: 2, name: 'AACCUP Accreditation 2022' },
    { id: 3, name: 'AACCUP Accreditation 2023' },
    { id: 4, name: 'AACCUP Accreditation 2024' },
    { id: 5, name: 'AACCUP Accreditation 2025' },
  ];

  const filteredArchives = archives.filter((archive) =>
    archive.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DeanLayout>
      <div className='flex-1 min-h-screen bg-slate-50'>
        {/* Header */}
        <div className='sticky top-0 z-40 bg-white border-b border-slate-200'>
          <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3'>
            <h2 className='text-xl font-bold text-slate-900'>Archive</h2>

            <div className='flex items-center gap-3'>
              <div className='relative'>
                <Search className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
                <input
                  type='text'
                  placeholder='Search archive...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-64 rounded-full border border-slate-300 bg-white py-2 pl-9 pr-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-transparent focus:ring-2 focus:ring-emerald-200'
                />
              </div>

              <button
                type='button'
                className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-600 px-4 py-2 text-white shadow-sm transition hover:bg-emerald-500 active:scale-95'
                title='Add archive folder'
              >
                <FolderPlus className='h-5 w-5' />
                Add Folder
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='mx-auto max-w-7xl px-4 py-6'>
          {filteredArchives.length > 0 ? (
            <section className='rounded-xl border border-slate-200 bg-white shadow-sm'>
              <header className='border-b border-slate-200 px-4 py-3'>
                <h3 className='text-lg font-semibold text-slate-900'>Archived Collections</h3>
                <p className='mt-0.5 text-sm text-slate-500'>
                  Store and manage accreditation periods and documents that are no longer active.
                </p>
              </header>

              <div className='grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {filteredArchives.map((folder) => (
                  <div
                    key={folder.id}
                    className='group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md'
                    role='button'
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
                    }}
                  >
                    <div className='rounded-full bg-emerald-50 p-3 ring-1 ring-emerald-100 transition group-hover:bg-emerald-100'>
                      <Archive className='h-8 w-8 text-emerald-700' />
                    </div>
                    <p className='mt-3 line-clamp-2 max-w-[220px] text-sm font-medium text-slate-900'>
                      {folder.name}
                    </p>
                    <span className='mt-1 text-xs text-slate-500'>Archive</span>

                    {/* Subtle focus ring for accessibility */}
                    <span className='pointer-events-none absolute inset-0 rounded-xl ring-0 ring-emerald-200 group-focus-within:ring-2' />
                  </div>
                ))}

                {/* Add new archive card */}
                <button
                  type='button'
                  className='flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95'
                  title='Create archive folder'
                >
                  <FolderPlus className='mb-2 h-8 w-8' />
                  <p className='text-sm font-medium'>Add Archive Folder</p>
                </button>
              </div>
            </section>
          ) : (
            <div className='flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm'>
              <div className='rounded-full bg-slate-100 p-6 ring-1 ring-slate-200'>
                <Archive className='h-12 w-12 text-slate-500' />
              </div>
              <p className='mt-4 text-lg font-semibold text-slate-900'>No archive folders to display</p>
              <p className='mt-1 text-sm text-slate-500'>
                Create your first archive folder to store completed accreditation cycles.
              </p>
              <button
                type='button'
                className='mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-600 px-4 py-2 text-white shadow-sm transition hover:bg-emerald-500 active:scale-95'
              >
                <FolderPlus className='h-5 w-5' />
                Add Folder
              </button>
            </div>
          )}
        </div>
      </div>
    </DeanLayout>
  );
};

export default ArchivePage;
