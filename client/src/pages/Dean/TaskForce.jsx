import React, { useMemo, useState, useCallback } from 'react';
import PATH from '../../constants/path';
import { Search, UserRoundPlus, UserRoundX } from 'lucide-react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { useTaskForce } from '../../hooks/Dean/useTaskForce';
import VerifiedUserSkeletonLoader from '../../components/Loaders/VerifiedUserSkeletonLoader';
import getProfilePicPath from '../../utils/getProfilePicPath';
import TaskForceCard from '../../components/Dean/TaskForce/TaskForceCard';
import TaskForceModal from '../../components/Dean/TaskForce/TaskForceModal';
import { searchUser } from '../../assets/icons';
import useDebouncedValue from '../../hooks/useDebouncedValue';

const { TASK_FORCE_DETAIL } = PATH.DEAN;

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'chairs', label: 'Chairs' },
  { id: 'members', label: 'Members' },
];

const getUserId = (u) => u?.user_uuid || u?.uuid || u?.id;
const getUserName = (u) => u?.fullName || u?.full_name || u?.name || '';
const getUserEmail = (u) => u?.email || '';

const TaskForce = () => {
  const { navigate, refs, states, datas, handlers } = useTaskForce();
  const { dropdownRef } = refs;
  const { activeDropdownId, setActiveDropdownId } = states;

  const {
    taskForceChair,
    taskForceMember,
    updatedValue,
    emailAlreadyExist,
    modalType,
    modalData,
    isUpdateBtnDisabled,
    loading,
    selectedUser,
    formValue,
    infoClick,
    searchOpen,
    searchQuery,
    accessTokens,
    loadingAccessTokens,
    errorAccessTokens,
    refetchAccessTokens,
  } = datas;

  const {
    handleChevronClick,
    handleConfirmDelete,
    handleDropdown,
    handleDropdownMenuClick,
    handleEllipsisClick,
    handleChange,
    handleInfoClick,
    handleCloseModal,
    handleProfilePicUpdate,
    handleProfilePic,
    handleAddUser,
    handleAddUserInputChange,
    handleSaveAdded,
    handleSaveUpdate,
    handleAddCardClick,
    handleSearchToggle,
    handleSearchChange,
  } = handlers;

  const [activeTabId, setActiveTabId] = useState('all');

  const debouncedQuery = useDebouncedValue(searchQuery, 250);
  const lowerQ = (debouncedQuery || '').toLowerCase();

  const filterByQuery = useCallback(
    (arr) =>
      !lowerQ
        ? arr
        : arr.filter(
            (u) =>
              getUserName(u).toLowerCase().includes(lowerQ) ||
              getUserEmail(u).toLowerCase().includes(lowerQ)
          ),
    [lowerQ]
  );

  const chairsCount = taskForceChair.length;
  const membersCount = taskForceMember.length;
  const totalCount = chairsCount + membersCount;

  const tabbed = useMemo(() => {
    const chairs = filterByQuery(taskForceChair);
    const members = filterByQuery(taskForceMember);
    switch (activeTabId) {
      case 'chairs':
        return [{ data: chairs, label: 'Task Force Chair' }];
      case 'members':
        return [{ data: members, label: 'Task Force Member' }];
      default:
        return [
          { data: chairs, label: 'Task Force Chair' },
          { data: members, label: 'Task Force Member' },
        ];
    }
  }, [activeTabId, taskForceChair, taskForceMember, filterByQuery]);

  const chairsFiltered = filterByQuery(taskForceChair);
  const membersFiltered = filterByQuery(taskForceMember);
  const allHasAny = chairsCount > 0 || membersCount > 0;
  const allFilteredEmpty = chairsFiltered.length === 0 && membersFiltered.length === 0;

  return (
    <DeanLayout>
      <div className='flex-1 min-h-screen bg-slate-50'>
        {/* Page header */}
        <div className='border-b border-slate-200 bg-white'>
          <div className='max-w-7xl mx-auto px-4 py-6'>
            <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
              <div className='space-y-2'>
                <h1 className='text-xl md:text-2xl font-semibold text-slate-900'>Task Force</h1>
              </div>

              {/* Actions */}
              <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end md:w-auto'>
                <div className='relative w-full sm:w-72'>
                  <Search className='pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400' />
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder='Search name or email...'
                    className='w-full rounded-full border border-slate-300 bg-white pl-10 pr-20 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400'
                  />
                  {searchQuery && (
                    <button
                      type='button'
                      onClick={() => handleSearchChange('')}
                      className='absolute right-2 top-1.5 rounded-full border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50'
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  title={totalCount > 0 ? 'Add Task Force' : 'Create Task Force'}
                  onClick={handleAddUser}
                  type='button'
                  className='inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-500 cursor-pointer active:scale-95'
                >
                  <UserRoundPlus className='h-5 w-5' />
                  <span>Add New</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='max-w-7xl mx-auto px-4 py-6'>
          {/* Tabs */}
          <div className='mb-5'>
            <div className='inline-flex rounded-full border border-slate-300 bg-white p-1'>
              {TABS.map((t) => {
                const preCount =
                  t.id === 'chairs' ? chairsCount : t.id === 'members' ? membersCount : totalCount;
                const active = activeTabId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTabId(t.id)}
                    type='button'
                    className={[
                      'px-4 py-2 text-sm rounded-full transition cursor-pointer',
                      active ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100',
                    ].join(' ')}
                    title={`${t.label} (${preCount})`}
                  >
                    {t.label} {preCount ? `(${preCount})` : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <VerifiedUserSkeletonLoader />
          ) : (
            <>
              {activeTabId === 'all' ? (
                allHasAny &&
                (allFilteredEmpty ? (
                  // SEARCH-EMPTY state (All tab)
                  <section className='rounded-xl border border-slate-200 bg-white shadow-sm'>
                    <div className='min-h-[40vh] grid place-items-center p-8 text-center'>
                      <div>
                        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
                          <UserRoundX className='h-8 w-8 text-slate-400' />
                        </div>
                        <h3 className='text-lg font-semibold text-slate-900'>No results</h3>
                        <p className='mt-1 text-sm text-slate-600'>
                          {debouncedQuery ? <>Nothing matched ‘{debouncedQuery}’.</> : 'Try adjusting your search.'}
                        </p>
                        <div className='mt-5 flex items-center justify-center gap-3'>
                          {debouncedQuery && (
                            <button
                              type='button'
                              onClick={() => handleSearchChange('')}
                              className='rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400'
                            >
                              Clear search
                            </button>
                          )}
                          <button
                            type='button'
                            onClick={handleAddUser}
                            className='inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400'
                          >
                            <UserRoundPlus className='h-5 w-5' /> Add New
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                ) : (
                  // NORMAL All-tab sections
                  <div className='space-y-8'>
                    {chairsFiltered.length > 0 && (
                      <section className='rounded-xl border border-slate-200 bg-white shadow-sm'>
                        <header className='px-4 py-3 border-b border-slate-200 flex items-center justify-between'>
                          <h3 className='text-base font-semibold text-slate-900'>
                            {chairsFiltered.length > 1 ? 'Chairs' : 'Chair'}
                          </h3>
                          <span className='text-xs text-slate-600'>{chairsFiltered.length}</span>
                        </header>
                        <div className='p-4'>
                          <TaskForceCard
                            dropdownRef={dropdownRef}
                            activeDropdownId={activeDropdownId}
                            setActiveDropdownId={setActiveDropdownId}
                            label='Task Force Chair'
                            taskForce={chairsFiltered}
                            navigation={(user) => navigate(TASK_FORCE_DETAIL(getUserId(user)))}
                            profilePic={(user) => getProfilePicPath(user.profilePicPath)}
                            handleDropdown={handleDropdown}
                            handleEllipsisClick={handleEllipsisClick}
                            handleAddCardClick={handleAddCardClick}
                          />
                        </div>
                      </section>
                    )}

                    {membersFiltered.length > 0 && (
                      <section className='rounded-xl border border-slate-200 bg-white shadow-sm'>
                        <header className='px-4 py-3 border-b border-slate-200 flex items-center justify-between'>
                          <h3 className='text-base font-semibold text-slate-900'>
                            {membersFiltered.length > 1 ? 'Members' : 'Member'}
                          </h3>
                          <span className='text-xs text-slate-600'>{membersFiltered.length}</span>
                        </header>
                        <div className='p-4'>
                          <TaskForceCard
                            dropdownRef={dropdownRef}
                            activeDropdownId={activeDropdownId}
                            setActiveDropdownId={setActiveDropdownId}
                            label='Task Force Member'
                            taskForce={membersFiltered}
                            navigation={(user) => navigate(TASK_FORCE_DETAIL(getUserId(user)))}
                            profilePic={(user) => getProfilePicPath(user.profilePicPath)}
                            handleDropdown={handleDropdown}
                            handleEllipsisClick={handleEllipsisClick}
                            handleAddCardClick={handleAddCardClick}
                          />
                        </div>
                      </section>
                    )}
                  </div>
                ))
              ) : (
                // Single tab (Chairs / Members)
                tabbed.map(({ data, label }) =>
                  data.length > 0 ? (
                    <section key={label} className='rounded-xl border border-slate-200 bg-white shadow-sm'>
                      <header className='px-4 py-3 border-b border-slate-200 flex items-center justify-between'>
                        <h3 className='text-base font-semibold text-slate-900'>
                          {data.length > 1 ? `${label}s` : label}
                        </h3>
                        <span className='text-xs text-slate-600'>{data.length}</span>
                      </header>
                      <div className='p-4'>
                        <TaskForceCard
                          dropdownRef={dropdownRef}
                          activeDropdownId={activeDropdownId}
                          setActiveDropdownId={setActiveDropdownId}
                          label={label}
                          taskForce={data}
                          navigation={(user) => navigate(TASK_FORCE_DETAIL(getUserId(user)))}
                          profilePic={(user) => getProfilePicPath(user.profilePicPath)}
                          handleDropdown={handleDropdown}
                          handleEllipsisClick={handleEllipsisClick}
                          handleAddCardClick={handleAddCardClick}
                        />
                      </div>
                    </section>
                  ) : (
                    <section key={label} className='rounded-xl border border-slate-200 bg-white shadow-sm'>
                      <div className='min-h-[40vh] grid place-items-center p-8 text-center'>
                        <div>
                          <img className='mx-auto h-40 w-40 opacity-80' src={searchUser} alt='No results' />
                          <p className='mt-4 text-base text-slate-700'>
                            No {label.toLowerCase()}s found
                            {debouncedQuery ? ` for ‘${debouncedQuery}’` : ''}.
                          </p>
                          <div className='mt-5 flex items-center justify-center gap-3'>
                            {debouncedQuery && (
                              <button
                                type='button'
                                onClick={() => handleSearchChange('')}
                                className='rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400'
                              >
                                Clear search
                              </button>
                            )}
                            <button
                              type='button'
                              onClick={handleAddUser}
                              className='inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400'
                            >
                              <UserRoundPlus className='h-5 w-5' /> Add New
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  )
                )
              )}

              {/* Page-level empty state */}
              {!loading && totalCount === 0 && activeTabId === 'all' && (
                <div className='min-h-[60vh] grid place-items-center text-center'>
                  <div>
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
                      <UserRoundX className='h-8 w-8 text-slate-400' />
                    </div>
                    <h3 className='text-lg font-semibold text-slate-900'>No task force data</h3>
                    <p className='mt-1 text-sm text-slate-600'>Create your first entry to get started.</p>
                    <div className='mt-5 flex items-center justify-center gap-3'>
                      <button
                        type='button'
                        onClick={handleAddUser}
                        className='inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400'
                      >
                        <UserRoundPlus className='h-5 w-5' /> Create
                      </button>
                      {searchQuery && (
                        <button
                          type='button'
                          onClick={() => handleSearchChange('')}
                          className='rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400'
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <TaskForceModal
        data={{
          taskForceChair,
          taskForceMember,
          loading,
          modalType,
          modalData,
          formValue,
          emailAlreadyExist,
          updatedValue,
          selectedUser,
          infoClick,
          isUpdateBtnDisabled,
          accessTokens,
          loadingAccessTokens,
          errorAccessTokens,
          refetchAccessTokens,
        }}
        handlers={{
          handleCloseModal,
          handleInfoClick,
          handleProfilePic,
          handleProfilePicUpdate,
          setUpdatedProfilePic: states.setUpdatedProfilePic,
          handleAddUserInputChange,
          handleSaveAdded,
          handleChange,
          handleSaveUpdate,
          handleChevronClick,
          handleDropdownMenuClick,
          toggleDropdown: states.setToggleDropdown,
          handleConfirmDelete,
        }}
      />
    </DeanLayout>
  );
};

export default TaskForce;
