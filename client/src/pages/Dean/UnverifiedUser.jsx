import { ChevronDown, ChevronLeft, ShieldCheck, ShieldUser, Trash2 } from 'lucide-react';
import { useUnverifiedUsers } from '../../hooks/useUnverifiedUsers';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import UserProfileModal from '../../components/Modals/UserProfileModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import UpdateUserModal from '../../components/Modals/user/UpdateUserModal';
import MODAL_TYPE from '../../constants/modalTypes';
import Dropdown from '../../components/Dropdown/Dropdown';
import TimeAgo from '../../components/TimeAgo';

const UnverifiedUsers = () => {

  const { user, modal, ui, data, actions } = useUnverifiedUsers();
  const { selectedUser, selectedRole} = user;
  const { modalType} = modal;
  const { showDropdown} = ui;
  const { unverifiedUsers, USER_ROLES } = data;
  const { handleCloseModal } = actions.closeModal;
  const { handleRowClick } = actions.row;
  const { handleVerifyClick, handleVerifyConfirm } = actions.verify;
  const { handleDropdown } = actions.dropdown;
  const { handleRoleSelection } = actions.select;
  const { handleDeleteClick, handleDeleteConfirm } = actions.delete;
  const { handleSaveUpdate } = actions.update;

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
            isDelete={true}
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
            disabled={selectedRole === USER_ROLES.UNVERIFIED_USER}
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
                    <Dropdown width='w-full' position='top-13'>
                      {Object.entries(USER_ROLES).map(([key, role]) => (
                        role !== USER_ROLES.UNVERIFIED_USER &&
                        role !== USER_ROLES.DEAN &&
                        role !== selectedRole &&
                        <p
                          key={key}
                          className='px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer'
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
      <main className="px-4 py-6 md:px-8 w-full max-w-screen-xl mx-auto">
        <div className='bg-gray-400 rounded-t-md'>
          <h1 className="text-center p-2 text-3xl font-bold text-white">Unverified Users</h1>
        </div>

        {/* Table */}
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
                      className='hover:bg-gray-100 cursor-pointer hover:shadow-inner shadow-sm hover:transition active:opacity-50 active:transition' 
                      onClick={(e) => handleRowClick(e , user)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">{user.full_name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-500">
                        <TimeAgo date={user.created_at} />
                      </td>
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

export default UnverifiedUsers;
