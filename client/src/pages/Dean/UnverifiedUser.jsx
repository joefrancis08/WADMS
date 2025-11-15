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
import { USER_ROLES } from '../../constants/user';
import { deleteUser } from '../../assets/icons';

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const UnverifiedUsers = () => {
  const { refs, datas, handlers } = useUnverifiedUsers();
  const { roleDropdownRef } = refs;
  const {
    selectedUser,
    selectedRole,
    modalType,
    modalData,
    showDropdown,
    showProfile,
    unverifiedUsers
  } = datas;
  const {
    handleCloseModal, 
    handleRowClick,
    handleVerifyClick,
    handleConfirmVerification,
    handleDropdown,
    handleRoleSelection,
    handleDeleteClick,
    handleDeleteConfirm,
    handleUpdateRole
  } = handlers;

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
    if (showSearch) setSearchQuery('');
  };

  /** Render modal based on type */
  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPE.UU_PROFILE:
        return (
          <UserProfileModal
            selectedUser={selectedUser}
            onClose={() => handleCloseModal({ from: { profileCard: true } })}
            onVerifyClick={(e) => handleVerifyClick(e)}
            onDeleteClick={(e) => handleDeleteClick(e)}
          />
        );
      case MODAL_TYPE.UU_VERIFICATION_CONFIRMATION:
        return (
          <ConfirmationModal
            onClose={handleCloseModal}
            headerContent={
              <div className='flex items-center justify-start'>
                <p className='text-lg font-semibold text-slate-900'>
                  Confirm Verification
                </p>
              </div>
            }
            bodyContent={
              <div className='flex flex-col gap-y-3 items-center justify-center my-3'>
                <ShieldCheck className='text-emerald-600 h-16 w-16'/>
                <p className='pb-4 max-w-100 text-center text-slate-700'>
                  Do you want to verify <span className='font-medium'>{selectedUser?.full_name}</span> with the role <span className='font-medium'>{modalData.selectedRole}</span>?
                </p>
              </div>
            }
            primaryButton='Confirm'
            secondaryButton='Cancel'
            onCancelClick={handleCloseModal}
            onConfirmClick={handleConfirmVerification}
            hasHeader={true}
          />
        );
      case MODAL_TYPE.UU_DELETION_CONFIRMATION:
        return (
          <ConfirmationModal
            onClose={handleCloseModal}
            hasHeader={true}
            headerContent={
              <div>
                <p className='text-lg font-semibold text-red-600'>
                  Confirm Delete
                </p>
              </div>
            }
            bodyContent={
              <div className='flex flex-col justify-center items-center'>
                <img src={deleteUser} alt='Delete User Icon' loading='lazy' className='h-16 w-16 my-3'/>
                <p className='text-center pb-8 text-slate-700'>
                  Do you want to delete <span className='font-medium'>{selectedUser?.full_name}</span>?
                </p>
              </div>
            }
            isDelete
            primaryButton='Confirm'
            secondaryButton='Cancel'
            onCancelClick={handleCloseModal}
            onConfirmClick={handleDeleteConfirm}
          />
        );
      case MODAL_TYPE.UU_UPDATE:
        return (
          <UpdateUserModal
            onClose={() => handleCloseModal({ clearDropdown: true })}
            onCancelClick={handleCloseModal}
            onSaveClick={handleUpdateRole}
            headerContent={`Assign Role to ${selectedUser?.full_name}`}
            primaryButton='Next'
            disabled={selectedRole === USER_ROLES.UU}
            disabledMessage={`Select other role aside from ${USER_ROLES.UU} to enable this button`}
            secondaryButton='Cancel'
            bodyContent={
              <div className='relative w-full'>
                <p className='text-sm px-1 my-2 text-slate-700'>
                  Select role, then click <span className='font-medium'>Next</span> to confirm verification.
                </p>
                <div ref={roleDropdownRef} className='input-container-layout relative'>
                  <span className='input-icon-layout'>
                    <ShieldUser className='text-slate-500' size={24} />
                  </span>
                  <input
                    readOnly
                    type='text'
                    name='role'
                    value={selectedRole}
                    onClick={handleDropdown}
                    className='border border-slate-300 text-slate-800 hover:cursor-pointer hover:bg-slate-50 input-field-style focus:outline-none transition'
                  />
                  <ChevronDown
                    onClick={handleDropdown}
                    className={`absolute top-4 right-4 cursor-pointer text-slate-500 hover:text-slate-700 transition ${showDropdown ? '-rotate-180' : ''}`}
                  />
                  {showDropdown && (
                    <Dropdown width='w-full' position='top-13' border='rounded-md border border-slate-300 bg-white shadow-md'>
                      {Object.entries(USER_ROLES)
                        .filter(
                          ([_, role]) =>
                            role !== USER_ROLES.UU &&
                            role !== USER_ROLES.DEAN &&
                            role !== selectedRole
                        )
                        .map(([key, role]) => (
                          <p
                            key={key}
                            className='px-4 py-2 text-slate-800 hover:bg-slate-100 cursor-pointer rounded-md'
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
      <main className='flex-1 h-full bg-slate-50'>
        {/* Header */}
        <div className='flex flex-col md:flex-row items-center justify-between py-2 px-4 bg-white border-l border-b border-slate-200 z-50 mb-4 gap-2 md:gap-0'>
          <h2 className='text-xl text-slate-900 font-bold'>Unverified Users</h2>

          {/* Search toggle / input */}
          {showSearch ? (
            <div className='relative w-full max-w-md'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400' />
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
                placeholder='Search name or email…'
                className='pl-10 pr-10 py-2 rounded-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-transparent w-full transition-all'
              />
              <button
                onClick={() => setShowSearch(false)}
                className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer'
                title='Close search'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          ) : (
            <button
              onClick={toggleSearch}
              className='text-slate-700 p-2 hover:bg-slate-100 rounded-full cursor-pointer active:scale-95'
              title='Search'
            >
              <Search className='h-6 w-6' />
            </button>
          )}
        </div>

        {/* Table */}
        <div className='px-4 pb-10'>
          <div className='overflow-auto rounded-2xl border border-slate-200 bg-white shadow'>
            <table className='min-w-full divide-y divide-slate-200'>
              <thead className='bg-slate-50 sticky top-0 z-10 border-b border-slate-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700'></th>
                  <th
                    className='flex gap-x-1 items-center px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 cursor-pointer select-none'
                    onClick={() => requestSort('full_name')}
                  >
                    Name {sortConfig.key === 'full_name' 
                    ? (sortConfig.direction === 'asc' 
                      ? (<ArrowUp className='h-5 w-5 text-slate-500'/>) : (<ArrowDown className='h-5 w-5 text-slate-500'/>)) 
                    : ''}
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700'>
                    Email
                  </th>
                  <th
                    className='flex items-center gap-x-1 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 cursor-pointer select-none'
                    onClick={() => requestSort('created_at')}
                  >
                    Registration Date & Time{' '}
                    {sortConfig.key === 'created_at' 
                      ? (sortConfig.direction === 'asc' ? 
                          (<ArrowUp className='h-5 w-5 text-slate-500'/>) : (<ArrowDown className='h-5 w-5 text-slate-500'/>)) 
                      : ''
                    }
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-700'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200'>
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='py-8 text-center text-slate-700 text-base'>
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
                      className={`transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                      } hover:bg-slate-100 cursor-pointer`}
                    >
                      <td className='px-4 py-2'>
                        <div className='flex items-center justify-center shrink-0'>
                          <img
                            src={
                              user?.profile_pic_path?.startsWith('http')
                                ? user?.profile_pic_path
                                : `${PROFILE_PIC_PATH}/${user?.profile_path_path || 'default-profile-picture.png'}`
                            } 
                            className='flex shrink-0 h-10 w-10 rounded-full object-cover border border-slate-200'
                          />
                        </div>
                      </td>
                      <td className='px-6 py-4 text-slate-900 font-medium'>{user.full_name}</td>
                      <td className='px-6 py-4 text-slate-700'>{user.email}</td>
                      <td className='px-6 py-4 text-slate-600'>
                        <TimeAgo date={user.created_at} />
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex justify-center items-center gap-3'>
                          <button
                            title={`Verify ${user.full_name}?`}
                            onClick={(e) => handleVerifyClick(e, { selectedUser: user, from: { row: true } })}
                            className='flex items-center justify-center bg-gradient-to-br from-emerald-600 to-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-emerald-500 hover:to-green-400 hover:shadow-md active:scale-95 transition-all cursor-pointer'
                          >
                            <ShieldCheck className='mr-1' size={18} />
                            Verify
                          </button>
                          <button
                            title={`Delete ${user.full_name}?`}
                            onClick={(e) => handleDeleteClick(e, { selectedUser: user, from: { row: true } })}
                            className='p-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all cursor-pointer'
                          >
                            <Trash2 className='text-red-500 hover:text-red-600 transition' size={20} />
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
