import React from 'react';
import {
  PlusCircle,
  EllipsisVertical,
  LinkIcon,
  FileUser,
  UserRoundPen,
  Trash2,
  SearchX
} from 'lucide-react';
import Dropdown from '../../Dropdown/Dropdown';
import ProfilePicture from '../../ProfilePicture';

/**
 * InternalAssessorCard
 * - Keeps all behavior/handlers intact.
 * - Light theme & card layout consistent with task-force style.
 *
 * Props:
 *  assessors, activeAssessorId, menuOptionsRef,
 *  handleEllipsisClick, handleMenuItems, handleAddNew,
 *  searchTerm, onResetSearch
 */
const InternalAssessorCard = ({
  assessors = [],
  activeAssessorId,
  menuOptionsRef,
  handleEllipsisClick = () => {},
  handleMenuItems = () => {},
  handleAddNew = () => {},
  searchTerm,
  onResetSearch = () => {},
}) => {
  const menuOptions = [
    { icon: <LinkIcon size={18} />, label: 'View Access Link' },
    { icon: <FileUser size={18} />, label: 'View Details' },
    { icon: <UserRoundPen size={18} />, label: 'Update' },
    { icon: <Trash2 size={18} color='red' />, label: 'Delete' }
  ];

  const getUserId = (u) => u.id;

  const renderMenuOptions = (user) => {
    const id = getUserId(user);
    if (activeAssessorId !== id) return null;

    return (
      <div ref={menuOptionsRef} className='absolute right-2 top-10 z-50'>
        <Dropdown width='w-56' border='border border-slate-200 rounded-md bg-white shadow-lg'>
          {menuOptions.map((menu, idx) => (
            <React.Fragment key={idx}>
              {menu.label === 'Delete' && <hr className='my-1 text-slate-200' />}
              <div
                onClick={(e) => handleMenuItems(e, menu, user)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm cursor-pointer transition hover:bg-slate-50 ${
                  menu.label === 'Delete' ? 'text-red-600' : 'text-slate-700'
                }`}
                role='menuitem'
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMenuItems?.(e, menu, user);
                  }
                }}
              >
                <i className='shrink-0'>{menu.icon}</i>
                <p>{menu.label}</p>
              </div>
            </React.Fragment>
          ))}
        </Dropdown>
      </div>
    );
  };

  // Empty-state when search yielded no results
  if (!assessors || assessors.length === 0) {
    return (
      <div className='flex items-center justify-center'>
        <div
          className='w-full max-w-xl rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm'
          role='status'
          aria-live='polite'
        >
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
            <SearchX size={28} className='text-slate-500' />
          </div>
          <h3 className='text-lg font-semibold text-slate-900'>
            {searchTerm ? (
              <>
                No results for <span className='font-bold'>‘{searchTerm}’</span>
              </>
            ) : (
              'No assessors found'
            )}
          </h3>
          <p className='mt-2 text-sm text-slate-600'>
            {searchTerm
              ? 'Try adjusting your filters, checking the spelling, or clear your search.'
              : 'Get started by creating a new assessor.'}
          </p>

          <div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
            {searchTerm && (
              <button
                type='button'
                onClick={onResetSearch}
                className='inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50'
              >
                Clear search
              </button>
            )}
            <button
              type='button'
              onClick={handleAddNew}
              className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600/90'
            >
              <PlusCircle size={18} /> Add assessor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
      role='list'
      aria-label='Assessors'
    >
      {assessors.map((user) => (
        <div
          key={user.id}
          className='relative rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md'
          role='listitem'
        >
          {activeAssessorId === user.id && <div className='fixed inset-0 z-40' />}

          {/* Card menu button */}
          <button
            onClick={(e) => handleEllipsisClick?.(e, user)}
            className={`absolute right-2 top-2 rounded-full bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 cursor-pointer ${
              activeAssessorId === user.id ? 'ring ring-emerald-200 cursor-pointer' : ''
            }`}
            type='button'
            aria-label={`Open menu for ${user.full_name}`}
          >
            <EllipsisVertical size={18} />
          </button>

          {renderMenuOptions(user)}

          {/* Card body */}
          <div className='flex flex-col items-center px-4 pb-5 pt-8 text-center'>
            <div className='relative mb-4'>
              <div className='h-24 w-24 overflow-hidden rounded-full ring-2 ring-emerald-100'>
                {user.profile_pic_path ? (
                  <ProfilePicture profilePic={user.profile_pic_path} width='w-24' height='h-24' />
                ) : (
                  <div className='flex h-full w-full items-center justify-center bg-slate-100 text-2xl font-bold text-slate-500'>
                    {user.full_name?.charAt(0) ?? '?'}
                  </div>
                )}
              </div>
            </div>

            <div className='w-full space-y-2'>
              <p
                className='mx-auto max-w-[220px] truncate rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-semibold text-slate-800'
                title={user.full_name}
              >
                {user.full_name}
              </p>
              {/* Reserve space for future metadata if needed */}
              {/* <p className='text-xs text-slate-500'>Department / Role</p> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InternalAssessorCard;
