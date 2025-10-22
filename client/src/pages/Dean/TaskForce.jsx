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
    refetchAccessTokens
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

  // add these near your other derived values, before return()
  const chairsFiltered = filterByQuery(taskForceChair);
  const membersFiltered = filterByQuery(taskForceMember);
  const allHasAny = chairsCount > 0 || membersCount > 0;
  const allFilteredEmpty = chairsFiltered.length === 0 && membersFiltered.length === 0;

  return (
    <DeanLayout>
      <div className="flex-1 h-full bg-slate-800">
        {/* Sticky toolbar */}
        <div className="sticky top-0 z-50 bg-slate-900 border-l border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl text-slate-100 font-bold flex items-center gap-2">
                  Task Force
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-200 border border-slate-600">{totalCount} total</span>
                </h2>
                <div className="hidden md:flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-200 border border-slate-600">
                    Chairs: {chairsCount}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-200 border border-slate-600">
                    Members: {membersCount}
                  </span>
                </div>
              </div>

              {/* Search + Add (desktop) */}
              <div className="hidden md:flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-4 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search name or email..."
                    className="ml-1 pl-9 pr-20 py-2 rounded-full bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 w-72 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="absolute right-2 top-1.5 rounded-full border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <button
                  title={totalCount > 0 ? 'Add Task Force' : 'Create Task Force'}
                  onClick={handleAddUser}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full shadow active:scale-95 transition cursor-pointer"
                >
                  <UserRoundPlus className="h-5 w-5" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Mobile: search toggle + add */}
              <div className="flex md:hidden items-center gap-2">
                <button
                  onClick={handleSearchToggle}
                  className="p-2 rounded-md hover:bg-slate-800 transition cursor-pointer"
                  aria-label="Toggle search"
                  type="button"
                >
                  <Search className="h-6 w-6 text-slate-100" />
                </button>
                <button
                  title={totalCount > 0 ? 'Add Task Force' : 'Create Task Force'}
                  onClick={handleAddUser}
                  className="p-2 rounded-md bg-green-600 hover:bg-green-500 text-white active:scale-95 transition cursor-pointer"
                  type="button"
                >
                  <UserRoundPlus className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Mobile search input */}
            {searchOpen && (
              <div className="pb-3 md:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search name or email"
                    className="pl-9 pr-16 py-2 rounded-md bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="absolute right-2 top-1.5 rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2">
              {TABS.map((t) => {
                const preCount =
                  t.id === 'chairs' ? chairsCount : t.id === 'members' ? membersCount : totalCount;
                const active = activeTabId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTabId(t.id)}
                    className={`px-4 py-2 rounded-t-md border-b-4 transition text-sm ${
                      active
                        ? 'border-yellow-400 text-slate-100 bg-slate-800'
                        : 'border-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                    title={`${t.label} (${preCount})`}
                    type="button"
                  >
                    {t.label} {preCount ? `(${preCount})` : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {loading ? (
            <VerifiedUserSkeletonLoader />
          ) : (
            <>
              {activeTabId === 'all' ? (
                  allHasAny && (
                    allFilteredEmpty ? (
                      // SEARCH-EMPTY state (All tab)
                      <section className="border bg-slate-900 border-slate-700 rounded-lg shadow">
                        <div className="min-h-[40vh] grid place-items-center p-6 text-center">
                          <div>
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900">
                              <UserRoundX className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-100">No results</h3>
                            <p className="mt-1 text-sm text-slate-300">
                              {debouncedQuery ? <>Nothing matched “{debouncedQuery}”.</> : "Try adjusting your search."}
                            </p>
                            <div className="mt-5 flex items-center justify-center gap-3">
                              {debouncedQuery && (
                                <button
                                  type="button"
                                  onClick={() => handleSearchChange('')}
                                  className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                >
                                  Clear search
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={handleAddUser}
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-600/90 focus:outline-none focus:ring-2 focus:ring-green-400"
                              >
                                <UserRoundPlus className="h-5 w-5" /> Add New
                              </button>
                            </div>
                          </div>
                        </div>
                      </section>
                    ) : (
                      // NORMAL All-tab sections (use precomputed filtered arrays)
                      <div className="space-y-10">
                        {chairsFiltered.length > 0 && (
                          <section className="border bg-slate-900 border-slate-700 rounded-lg shadow">
                            <header className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-slate-100">
                                {chairsFiltered.length > 1 ? 'Chairs' : 'Chair'}
                              </h3>
                              <span className="text-xs text-slate-300">{chairsFiltered.length}</span>
                            </header>
                            <div className="p-4">
                              <TaskForceCard
                                dropdownRef={dropdownRef}
                                activeDropdownId={activeDropdownId}
                                setActiveDropdownId={setActiveDropdownId}
                                label="Task Force Chair"
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
                          <section className="border bg-slate-900 border-slate-700 rounded-lg shadow">
                            <header className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-slate-100">
                                {membersFiltered.length > 1 ? 'Members' : 'Member'}
                              </h3>
                              <span className="text-xs text-slate-300">{membersFiltered.length}</span>
                            </header>
                            <div className="p-4">
                              <TaskForceCard
                                dropdownRef={dropdownRef}
                                activeDropdownId={activeDropdownId}
                                setActiveDropdownId={setActiveDropdownId}
                                label="Task Force Member"
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
                    )
                  )
                ) : (
                // Single tab (Chairs / Members)
                tabbed.map(({ data, label }) =>
                  data.length > 0 ? (
                    <section key={label} className="border bg-slate-900 border-slate-700 rounded-lg shadow">
                      <header className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-100">
                          {data.length > 1 ? `${label}s` : label}
                        </h3>
                        <span className="text-xs text-slate-300">{data.length}</span>
                      </header>
                      <div className="p-4">
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
                    <section key={label} className="border bg-slate-900 border-slate-700 rounded-lg shadow">
                      <div className="min-h-[40vh] grid place-items-center p-6 text-center">
                        <div>
                          <img className="mx-auto h-48 w-48 opacity-80" src={searchUser} alt="No results" />
                          <p className="mt-4 text-lg text-slate-200">
                            No {label.toLowerCase()}s found
                            {debouncedQuery ? ` for “${debouncedQuery}”` : ''}.
                          </p>
                          <div className="mt-5 flex items-center justify-center gap-3">
                            {debouncedQuery && (
                              <button
                                type="button"
                                onClick={() => handleSearchChange('')}
                                className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                              >
                                Clear search
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={handleAddUser}
                              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-600/90 focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                              <UserRoundPlus className="h-5 w-5" /> Add New
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
                <div className="min-h-[60vh] grid place-items-center text-center">
                  <div>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900">
                      <UserRoundX className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100">No task force data</h3>
                    <p className="mt-1 text-sm text-slate-300">Create your first entry to get started.</p>
                    <div className="mt-5 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleAddUser}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-600/90 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <UserRoundPlus className="h-5 w-5" /> Create
                      </button>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => handleSearchChange('')}
                          className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
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
          refetchAccessTokens
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
