import React, { useMemo, useState } from 'react';
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
import { useCallback } from 'react';

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

  const filterByQuery = useCallback((arr) =>
    !lowerQ
      ? arr
      : arr.filter(
          (u) =>
            getUserName(u).toLowerCase().includes(lowerQ) ||
            getUserEmail(u).toLowerCase().includes(lowerQ)
        ), [lowerQ]);

  const chairsCount = taskForceChair.length;
  const membersCount = taskForceMember.length;
  const totalCount = chairsCount + membersCount;

  const tabbed = useMemo(() => {
    const chairs = filterByQuery(taskForceChair);
    const members = filterByQuery(taskForceMember);
    switch (activeTabId) {
      case 'chairs':
        return [{ data: chairs, label: 'Chair' }];
      case 'members':
        return [{ data: members, label: 'Member' }];
      default:
        return [
          { data: chairs, label: 'Chair' },
          { data: members, label: 'Member' },
        ];
    }
  }, [activeTabId, taskForceChair, taskForceMember, filterByQuery]);

  return (
    <DeanLayout>
      <div className="flex-1 h-full bg-slate-800">
        {/* Sticky toolbar */}
        <div className="sticky top-0 z-50 bg-slate-900 border-l border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl text-slate-100 font-bold">Task Force</h2>
                <div className="hidden md:flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-200 border border-slate-600">
                    Total: {totalCount}
                  </span>
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
                    className="ml-1 pl-9 pr-3 py-2 rounded-full bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 w-72 transition-all"
                  />
                </div>
                <button
                  title={totalCount > 0 ? 'Add Task Force' : 'Create Task Force'}
                  onClick={handleAddUser}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full shadow active:scale-95 transition cursor-pointer"
                >
                  <UserRoundPlus className="h-5 w-5" />
                  <span>Add</span>
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
                    className="pl-9 pr-3 py-2 rounded-md bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full"
                  />
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
                    className={`px-4 py-2 rounded-t-md border-b-3 transition text-sm ${
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
                (chairsCount > 0 || membersCount > 0) && (
                  <div className="space-y-10">
                    {/* Chairs */}
                    {filterByQuery(taskForceChair).length > 0 && (
                      <section className="border bg-slate-900 border-slate-700 rounded-lg shadow">
                        <header className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-slate-100">
                            {filterByQuery(taskForceChair).length > 1 ? 'Chairs' : 'Chair'}
                          </h3>
                          <span className="text-xs text-slate-300">
                            {filterByQuery(taskForceChair).length}
                          </span>
                        </header>
                        <div className="p-4">
                          <TaskForceCard
                            dropdownRef={dropdownRef}
                            activeDropdownId={activeDropdownId}
                            setActiveDropdownId={setActiveDropdownId}
                            label="Chair"
                            taskForce={filterByQuery(taskForceChair)}
                            navigation={(user) => navigate(TASK_FORCE_DETAIL(getUserId(user)))}
                            profilePic={(user) => getProfilePicPath(user.profilePicPath)}
                            handleDropdown={handleDropdown}
                            handleEllipsisClick={handleEllipsisClick}
                            handleAddCardClick={handleAddCardClick}
                          />
                        </div>
                      </section>
                    )}

                    {/* Members */}
                    {filterByQuery(taskForceMember).length > 0 && (
                      <section className="border bg-slate-900 border-slate-700 rounded-lg shadow">
                        <header className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-slate-100">
                            {filterByQuery(taskForceMember).length > 1 ? 'Members' : 'Member'}
                          </h3>
                          <span className="text-xs text-slate-300">
                            {filterByQuery(taskForceMember).length}
                          </span>
                        </header>
                        <div className="p-4">
                          <TaskForceCard
                            dropdownRef={dropdownRef}
                            activeDropdownId={activeDropdownId}
                            setActiveDropdownId={setActiveDropdownId}
                            label="Member"
                            taskForce={filterByQuery(taskForceMember)}
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
                      <div className="flex flex-col items-center justify-center p-10">
                        <img className="h-64 w-64 opacity-80" src={searchUser} alt="" />
                        <p className="mt-4 text-lg text-slate-200">
                          No {label.toLowerCase()}s found
                          {debouncedQuery ? ` for “${debouncedQuery}”` : ''}.
                        </p>
                      </div>
                    </section>
                  )
                )
              )}

              {/* Page-level empty state */}
              {!loading && totalCount === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <UserRoundX className="text-slate-600 w-28 h-28" />
                  <p className="mt-4 text-lg text-slate-300">No data to display at the moment.</p>
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
