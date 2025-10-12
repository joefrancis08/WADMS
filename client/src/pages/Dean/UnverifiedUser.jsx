import { ArrowDown, ArrowUp, ChevronDown, Search, ShieldCheck, ShieldUser, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import UserProfileModal from '../../components/Modals/UserProfileModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import UpdateUserModal from '../../components/Modals/user/UpdateUserModal';
import MODAL_TYPE from '../../constants/modalTypes';
import Dropdown from '../../components/Dropdown/Dropdown';
import TimeAgo from '../../components/TimeAgo';
import { useUnverifiedUsers } from '../../hooks/useUnverifiedUsers';
import { useState, useMemo, useEffect, useRef } from 'react';

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const UnverifiedUsers = () => {
  const { user, modal, ui, data, actions } = useUnverifiedUsers();
  const { selectedUser, selectedRole } = user;
  const { modalType } = modal;
  const { showDropdown } = ui;
  const { unverifiedUsers, USER_ROLES } = data;

  const {
    closeModal: { handleCloseModal },
    row: { handleRowClick },
    verify: { handleVerifyClick, handleVerifyConfirm },
    delete: { handleDeleteClick, handleDeleteConfirm },
    dropdown: { handleDropdown },
    select: { handleRoleSelection },
    update: { handleSaveUpdate },
  } = actions;

  // States
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  // Memoized sorted & filtered users
  const sortedUsers = useMemo(() => {
    let filteredUsers = [...unverifiedUsers];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.full_name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q)
      );
    }

    if (sortConfig.key) {
      filteredUsers.sort((a, b) => {
        if (sortConfig.key === 'full_name') {
          return sortConfig.direction === 'asc'
            ? a.full_name.localeCompare(b.full_name)
            : b.full_name.localeCompare(a.full_name);
        } else if (sortConfig.key === 'created_at') {
          return sortConfig.direction === 'asc'
            ? new Date(a.created_at) - new Date(b.created_at)
            : new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
      });
    }

    return filteredUsers;
  }, [unverifiedUsers, sortConfig, searchQuery]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) setSearchQuery(''); // Clear search when hiding
  };

  /** Render modal based on type */
  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPE.UU_PROFILE:
        return (
          <UserProfileModal
            selectedUser={selectedUser}
            onClose={handleCloseModal}
            onVerifyClick={(e) => handleVerifyClick(e)}
            onDeleteClick={(e) => handleDeleteClick(e)}
          />
        );
      case MODAL_TYPE.UU_VERIFICATION_CONFIRMATION:
        return (
          <ConfirmationModal
            onClose={handleCloseModal}
            headerContent={<p className="text-2xl font-bold text-gray-800">Confirm Verification</p>}
            bodyContent={<p className="pb-4">Are you sure you want to verify {selectedUser?.full_name}?</p>}
            primaryButton="Confirm"
            secondaryButton="Cancel"
            onCancelClick={handleCloseModal}
            onConfirmClick={handleVerifyConfirm}
          />
        );
      case MODAL_TYPE.UU_DELETION_CONFIRMATION:
        return (
          <ConfirmationModal
            onClose={handleCloseModal}
            headerContent={<p className="text-2xl font-bold text-red-600">Confirm Delete</p>}
            bodyContent={<p className="pb-4">Are you sure you want to delete {selectedUser?.full_name}?</p>}
            isDelete
            primaryButton="Confirm"
            secondaryButton="Cancel"
            onCancelClick={handleCloseModal}
            onConfirmClick={handleDeleteConfirm}
          />
        );
      case MODAL_TYPE.UPDATE_USER:
        return (
          <UpdateUserModal
            onClose={() => handleCloseModal({ clearDropdown: true })}
            onCancelClick={handleCloseModal}
            onSaveClick={handleSaveUpdate}
            headerContent={`Assign Role to ${selectedUser?.full_name}`}
            primaryButton="Save"
            disabled={selectedRole === USER_ROLES.UNVERIFIED_USER}
            secondaryButton="Cancel"
            bodyContent={
              <div className="relative w-full">
                <div className="input-container-layout relative">
                  <span className="input-icon-layout">
                    <ShieldUser color="gray" size={24} />
                  </span>
                  <input
                    readOnly
                    type="text"
                    name="role"
                    value={selectedRole}
                    onClick={handleDropdown}
                    className="border border-gray-400 text-gray-700 hover:cursor-pointer hover:bg-gray-100 input-field-style focus:outline-none transition"
                  />
                  <ChevronDown
                    onClick={handleDropdown}
                    className={`absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-600 transition ${
                      showDropdown ? 'rotate-180' : ''
                    }`}
                  />
                  {showDropdown && (
                    <Dropdown width="w-full" position="top-13">
                      {Object.entries(USER_ROLES)
                        .filter(
                          ([_, role]) =>
                            role !== USER_ROLES.UNVERIFIED_USER &&
                            role !== USER_ROLES.DEAN &&
                            role !== selectedRole
                        )
                        .map(([key, role]) => (
                          <p
                            key={key}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleRoleSelection(role)}
                          >
                            {role}
                          </p>
                        ))}
                    </Dropdown>
                  )}
                </div>
              </div>
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <main className="flex-1 h-full bg-slate-800">
        {/* Header */}
        <div className="sticky top-0 flex flex-col md:flex-row items-center justify-between py-2 px-4 bg-slate-900 border-l border-b border-slate-700 z-50 mb-4 gap-2 md:gap-0">
          <h2 className="text-xl text-slate-100 font-bold">Unverified Users</h2>

          {/* Search toggle / input — styled to match ProgramsToAccredit */}
          {showSearch ? (
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchQuery('');
                    setShowSearch(false);
                  }
                }}
                placeholder="Search name or email…"
                className="pl-10 pr-10 py-2 rounded-full bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-transparent w-full transition-all"
              />
              <button
                onClick={() => setShowSearch(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-700 text-slate-300 cursor-pointer"
                title="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={toggleSearch}
              className="text-slate-100 p-2 hover:bg-slate-700 rounded-full cursor-pointer active:scale-95"
              title="Search"
            >
              <Search className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="px-4 pb-10">
          <div className="overflow-auto rounded-2xl border border-slate-600 bg-slate-900/60 shadow-xl backdrop-blur-sm">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800/80 backdrop-blur sticky top-0 z-10 border-b border-slate-500">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-100"></th>
                  <th
                    className="flex gap-x-1 items-center px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-100 cursor-pointer"
                    onClick={() => requestSort('full_name')}
                  >
                    Name {sortConfig.key === 'full_name' 
                    ? (sortConfig.direction === 'asc' 
                      ? (<ArrowUp className='h-5 w-5'/>) : (<ArrowDown className='h-5 w-5'/>)) 
                    : ''}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-100">
                    Email
                  </th>
                  <th
                    className="flex items-center gap-x-1 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-100 cursor-pointer"
                    onClick={() => requestSort('created_at')}
                  >
                    Registration Date & Time{' '}
                    {sortConfig.key === 'created_at' 
                      ? (sortConfig.direction === 'asc' ? 
                          (<ArrowUp className='h-5 w-5'/>) : (<ArrowDown className='h-5 w-5'/>)) 
                      : ''
                    }
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-100 text-base">
                      {searchQuery
                        ? `No users found for "${searchQuery}".`
                        : 'No unverified users at the moment.'
                      }
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user, index) => (
                    <tr
                      key={user.user_uuid}
                      onClick={(e) => handleRowClick(e, user)}
                      className={`transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-slate-800/40' : 'bg-slate-800/20'
                      } hover:bg-slate-700/40 cursor-pointer`}
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center shrink-0">
                          <img
                            src={
                              user?.profilePicPath?.startsWith('http')
                                ? user.profilePicPath
                                : `${PROFILE_PIC_PATH}/${user.profilePicPath || 'default-profile-picture.png'}`
                            } 
                            className="h-10 w-10 rounded-full object-cover border border-slate-600"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-100 font-medium">{user.full_name}</td>
                      <td className="px-6 py-4 text-slate-300">{user.email}</td>
                      <td className="px-6 py-4 text-slate-400">
                        <TimeAgo date={user.created_at} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            title={`Verify ${user.full_name}?`}
                            onClick={(e) => handleVerifyClick(e, { selectedUser: user })}
                            className="flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-green-500 hover:to-emerald-400 hover:shadow-md active:scale-95 transition-all cursor-pointer"
                          >
                            <ShieldCheck className="mr-1" size={18} />
                            Verify
                          </button>
                          <button
                            title={`Delete ${user.full_name}?`}
                            onClick={(e) => handleDeleteClick(e, { selectedUser: user })}
                            className="p-2 rounded-full hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                          >
                            <Trash2 className="text-red-500 hover:text-red-400 transition" size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {renderModal()}
    </AdminLayout>
  );
};

export default UnverifiedUsers;