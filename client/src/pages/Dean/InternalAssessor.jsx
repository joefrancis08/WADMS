import React, { useState } from 'react';
import { Search, UserRoundPlus, UserRoundX } from 'lucide-react';
import InternalAssessorCard from '../../components/Dean/Internal_Assessor/InternalAssessorCard';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import useInternalAssessor from '../../hooks/Dean/useInternalAssessor';
import InternalAssessorModal from '../../components/Dean/Internal_Assessor/InternalAssessorModal';

const InternalAssessor = () => {
  const { refs, data, states, handlers } = useInternalAssessor();
  const { menuOptionsRef } = refs;
  const { setProfilePic } = states;
  const { modalType, modalData, activeAssessorId, formValue, assessors } = data;
  const {
    handleAddNew,
    handleEllipsisClick,
    handleCloseModal,
    handleProfilePic,
    handleFieldChange,
    handleAddAssessor,
    handleMenuItems,
    handleConfirmDelete
  } = handlers;

  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssessors = assessors.filter((user) =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = assessors.length;

  return (
    <DeanLayout>
      <div className='min-h-screen flex-1 bg-slate-50'>
        {/* Header */}
        <div className='border-b border-slate-200 bg-white'>
          <div className='mx-auto max-w-7xl px-4 py-4'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <h2 className='text-xl font-semibold text-slate-900'>
                Internal Assessors{' '}
                <span className='ml-2 align-middle text-xs font-medium text-slate-600'>
                  • {totalCount} total
                </span>
              </h2>

              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <Search className='pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400' />
                  <input
                    type='text'
                    placeholder='Search assessor…'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-64 rounded-full border border-slate-300 bg-white px-10 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200'
                  />
                </div>

                <button
                  onClick={handleAddNew}
                  className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600/90 hover:shadow'
                >
                  <UserRoundPlus className='h-5 w-5' />
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='mx-auto max-w-7xl px-4 py-6'>
          {totalCount > 0 ? (
            <section className='rounded-xl border border-slate-200 bg-white shadow-sm'>
              <header className='border-b border-slate-200 px-4 py-3'>
                <h3 className='text-sm font-semibold text-slate-900'>All Assessors</h3>
              </header>
              <div className='p-4'>
                <InternalAssessorCard
                  assessors={filteredAssessors}
                  menuOptionsRef={menuOptionsRef}
                  activeAssessorId={activeAssessorId}
                  handleEllipsisClick={handleEllipsisClick}
                  handleMenuItems={handleMenuItems}
                  searchTerm={searchQuery}
                  onResetSearch={() => setSearchQuery('')}
                  handleAddNew={handleAddNew}
                />
              </div>
            </section>
          ) : (
            // Empty state (no assessors yet)
            <div className='flex items-center justify-center py-20'>
              <div className='w-full max-w-xl rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
                  <UserRoundX className='h-8 w-8 text-slate-500' />
                </div>
                <h3 className='text-lg font-semibold text-slate-900'>No internal assessors</h3>
                <p className='mt-1 text-sm text-slate-600'>
                  Create your first assessor to get started.
                </p>
                <div className='mt-5 flex items-center justify-center gap-3'>
                  <button
                    onClick={handleAddNew}
                    type='button'
                    className='inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50'
                  >
                    <UserRoundPlus className='h-5 w-5' /> Add new
                  </button>
                  {searchQuery && (
                    <button
                      type='button'
                      onClick={() => setSearchQuery('')}
                      className='rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50'
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal (unchanged behavior) */}
      <InternalAssessorModal
        data={{ modalType, modalData, formValue }}
        states={{ setProfilePic }}
        handlers={{
          handleCloseModal,
          handleProfilePic,
          handleFieldChange,
          handleAddAssessor,
          handleConfirmDelete
        }}
      />
    </DeanLayout>
  );
};

export default InternalAssessor;
