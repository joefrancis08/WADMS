import { ChevronDown, ChevronLeft, ShieldCheck, ShieldUser, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminUnverifiedUsers } from '../../hooks/useAdminUnverifiedUsers';
import AdminLayout from '../../components/Layout/AdminLayout';
import dateFormatter from '../../utils/dateFormatter';
import UserProfileModal from '../../components/Modals/UserProfileModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import UpdateUserModal from '../../components/Modals/UpdateUserModal';
import MODAL_TYPE from '../../constants/modalTypes';

const AdminUnverifiedUsers = () => {

  const { user, modal, ui, data, actions } = useAdminUnverifiedUsers();
  const { selectedUser, setSelectedUser, selectedRole, setSelectedRole } = user;
  const { modalType, setModalType } = modal;
  const { showDropdown, setShowDropdown } = ui;
  const { unverifiedUsers, userRoles } = data;
  const { handleDelete, handleUpdateSubmit } = actions;

  const handleCloseModal = (options = {}) => {
    setModalType(null);
    setSelectedUser(null);

    if (options.clearDropdown) setShowDropdown(false);
  };

  const handleVerifyClick = (e, options = {}) => {
    e.stopPropagation();
    setModalType(MODAL_TYPE.USER_VERIFICATION_CONFIRMATION);

    if (options.selectedUser) setSelectedUser(options.selectedUser);
  };

  const handleDeleteClick = (e, options = {}) => {
    e.stopPropagation();
    setModalType(MODAL_TYPE.USER_DELETION_CONFIRMATION);

    if (options.selectedUser) setSelectedUser(options.selectedUser);
  };

  const handleVerifyConfirm = () => {
    setModalType(MODAL_TYPE.UPDATE_USER);
  };

  const handleDeleteConfirm = () => {
    handleDelete();
    setModalType(null);
  };

  const handleSaveUpdate = () => {
     handleUpdateSubmit();
     setSelectedRole(userRoles.DEFAULT);
     setModalType(null);
  }

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowDropdown(false);
  }

  const handleDropdown = () => {
    showDropdown ? setShowDropdown(false) : setShowDropdown(true);
  }

  const handleRowClick = (user) => {
    setModalType(MODAL_TYPE.USER_PROFILE);
    setSelectedUser(user);
  }

  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPE.USER_PROFILE:
        return (
          <UserProfileModal 
            selectedUser={selectedUser}
            onClose={handleCloseModal}
            onVerifyClick={(e) => handleVerifyClick(e)}
            onDeleteClick={(e) => handleDeleteClick(e)}
          />
        );

      case MODAL_TYPE.USER_VERIFICATION_CONFIRMATION:
        return (
          <ConfirmationModal
            onClose={handleCloseModal}
            headerContent={<p className="text-2xl font-bold text-gray-800">Confirm Verification</p>}
            bodyContent={<p className='pb-4'>Are you sure you want to verify {selectedUser?.full_name}?</p>}
            primaryButton={'Confirm'}
            secondaryButton={'Cancel'}
            onCancelClick={handleCloseModal}
            onConfirmClick={handleVerifyConfirm}
          />
        );

      case MODAL_TYPE.USER_DELETION_CONFIRMATION:
        return (
          <ConfirmationModal
            onClose={handleCloseModal}
            headerContent={<p className="text-2xl font-bold text-red-600">Confirm Delete</p>}
            bodyContent={<p className='pb-4'>Are you sure you want to delete {selectedUser?.full_name}?</p>}
            primaryButton={'Confirm'}
            secondaryButton={'Cancel'}
            onCancelClick={handleCloseModal}
            onConfirmClick={handleDeleteConfirm}
          />
        );

      case MODAL_TYPE.UPDATE_USER:
        return (
          <UpdateUserModal 
            onClose={() => handleCloseModal({clearDropdown: true})}
            onCancelClick={handleCloseModal}
            onSaveClick={handleSaveUpdate}
            headerContent={`Assign Role to ${selectedUser?.full_name}`}
            primaryButton={'Save'}
            secondaryButton={'Cancel'}
            bodyContent={
              <div className='relative w-full'>
                <div className='input-container-layout relative'>
                  <span className='input-icon-layout'>
                    <ShieldUser color='gray' size={24} />
                  </span>

                  {/* Readonly Input */}
                  <input
                    readOnly
                    type='text'
                    name='role'
                    onClick={handleDropdown}
                    className='border border-gray-400 transition text-gray-700 hover:cursor-pointer hover:bg-gray-100 input-field-style focus:outline-none'
                    value={selectedRole}
                  />

                  {/* Dropdown Icon */}
                  <ChevronDown
                    onClick={handleDropdown}
                    className={`absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-600 transition ${showDropdown && 'rotate-180'}`}
                  />

                  {/* Dropdown content */}
                  {showDropdown && (
                    <div className='absolute top-full left-0 w-full border border-gray-400 mt-1 bg-white shadow z-10 transition'>
                      {Object.entries(userRoles).map(([key, role]) => (
                        role !== userRoles.DEFAULT &&
                        <p
                          key={key}
                          className='px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer'
                          onClick={() => handleRoleSelection(role)}
                        >
                          {role}
                        </p>
                      ))}
                    </div>
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
      <main className="px-4 py-6 md:px-8 w-full max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/admin/users" className="text-gray-700">
            <ChevronLeft className='hover:opacity-65 active:opacity-50'/>
          </Link>
        </div>

        <div className='bg-gray-400 rounded-t-md'>
          <h1 className="text-center p-2 text-2xl font-bold text-white">Unverified Users</h1>
        </div>

        {/* Scrollable Table */}
        <div className="w-full overflow-x-auto rounded-b-md shadow-lg border border-gray-300">
          <table className="min-w-[700px] w-full">
            <thead className="bg-gray-300 text-gray-700 text-sm font-semibold border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Registration Date & Time</th>
                <th className="px-6 py-3 text-center">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {
                Array.isArray(unverifiedUsers) && unverifiedUsers.length === 0
                ? (
                  <tr>
                    <td colSpan={4} className='text-center py-4'>
                      <p className='text-lg text-gray-500'>No unverified users at the moment.</p>
                    </td>
                  </tr>
                )
                : unverifiedUsers.map((user) => (
                    <tr
                      title={`Click to see profile of ${user.full_name}`} 
                      key={user.id} 
                      className='hover:bg-gray-100 cursor-pointer hover:shadow-inner shadow-sm' 
                      onClick={() => handleRowClick(user)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">{user.full_name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-500">{dateFormatter(user.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-4">
                          <button
                            title={`Verify ${user.full_name}?`}
                            onClick={(e) => handleVerifyClick(e, {selectedUser: user})}
                            className="flex items-center justify-center bg-gradient-to-br from-green-800 to-green-500 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50 transition cursor-pointer">
                            <ShieldCheck className='mr-1' size={20}/>
                            Verify
                          </button>
                          <button
                            title={`Delete ${user.full_name}?`}
                            onClick={(e) => handleDeleteClick(e, {selectedUser: user})}
                          >
                            <Trash2 className='text-red-600 hover:text-red-500 active:opacity-50 transition hover:drop-shadow-lg cursor-pointer' fill='red' fillOpacity={0.1}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
            </tbody>
          </table>
        </div>
      </main>
      {renderModal()}
    </AdminLayout>
  );
};

export default AdminUnverifiedUsers;
