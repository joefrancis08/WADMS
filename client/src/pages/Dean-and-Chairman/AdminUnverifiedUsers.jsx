import { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ShieldCheck, ShieldUser, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import dateFormatter from '../../utils/dateFormatter';
import { useUsers } from '../../hooks/useUsers';
import UserProfileModal from '../../components/Modals/UserProfileModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import UpdateUserModal from '../../components/Modals/UpdateUserModal';
import axios from 'axios';
import { updateUserRole } from '../../api/Users/userAPI';

const AdminUnverifiedUsers = () => {
  const navigate = useNavigate();
  const { users, loading, error} = useUsers();
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isVerifyClicked, setIsVerifyClicked] = useState(false);
  const [isConfirmClicked, setIsConfirmClicked] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Unverified User');

  const unverifiedUsers = users?.data ?? [];

  const allowedRoles = ['Dean', 'Chairman', 'Accreditation Task Force', 'Accreditor', 'Clerk'];

  useEffect(() => {
  // Only run this if users is an array (not loading or error)
  if (Array.isArray(users?.data)) {
      const count = users.data.length;
      localStorage.setItem('userCount', JSON.stringify(count)); // safe, even if 0
    }
  }, [users]);

  const handleVerifyClick = (e) => {
    e.stopPropagation();
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation();
  }

  const handleRowClick = (id) => {
    setSelectedUser(unverifiedUsers.find(user => user.user_uuid === id));
    navigate(`/admin/users/unverified/${id}`);
  }

  const handleUpdateSubmit = async () => {
    try {
      const updatedUserRole = await updateUserRole(selectedUser.user_uuid, selectedRole);
      console.log('Updated user:', updatedUserRole);

    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  return (
    <AdminLayout>
      {selectedUser && modalType === 'user-profile' && 
        <UserProfileModal 
          selectedUser={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            navigate('/admin/users/unverified');
          }}
          onVerifyClick={(e) => {
            setModalType('confirmation');
            handleVerifyClick(e);
            setIsVerifyClicked(true);
          }}

          onDeleteClick={(e) => {
            handleDeleteClick(e)
          }}
        />
      }

      {isVerifyClicked && modalType === 'confirmation' &&  (
        <ConfirmationModal 
          selectedUser={selectedUser}
          onClose={() => {
            setIsVerifyClicked(false);
            setModalType(null);
          }}
          onCancelClick={() => {
            setModalType(null);
            setSelectedUser(null);
            navigate('/admin/users/unverified');
          }}
          onConfirmClick={() => {
            // Call your verify API here
            console.log(`Verifying user ${selectedUser?.full_name}`);
            setIsVerifyClicked(false);
            setIsConfirmClicked(true);
            setModalType('update-user');
          }}
        />
      )}

      {isConfirmClicked && modalType === 'update-user' && (
        <UpdateUserModal 
          onClose={() => {
            setShowDropdown(false);
            setIsConfirmClicked(false);
            setModalType(null);
          }}
          onCancelClick={() => {
            setModalType(null);
            navigate('/admin/users/unverified');
          }}
          onSaveClick={() => {
            handleUpdateSubmit();
            setSelectedRole('Unverified User');
            setIsConfirmClicked(false);
            navigate('/admin/users/unverified');
          }}
          header={`Assign Role to ${selectedUser?.full_name}`}
          body={
            <>
              <form onSubmit={handleUpdateSubmit}>
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
                      className='input-field-style focus:outline-none border border-gray-400 transition text-gray-700'
                      value={selectedRole}
                    />

                    {/* Dropdown Icon */}
                    <ChevronDown
                      onClick={() => {
                        showDropdown ? setShowDropdown(false) : setShowDropdown(true)
                      }}
                      className={`absolute top-4 right-4 hover:bg-gray-200 rounded-full cursor-pointer text-gray-500 hover:text-gray-600 transition ${showDropdown && 'rotate-180'}`}
                    />

                    {/* Dropdown content */}
                    {showDropdown && (
                      <div className='absolute top-full left-0 w-full border border-gray-400 mt-1 bg-white shadow z-10'>
                        {allowedRoles.map((role) => (
                          <p
                            key={role}
                            className='px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer'
                            onClick={() => {
                              setSelectedRole(role);
                              setShowDropdown(false);
                            }}
                          >
                            {role}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </form>

            </>
          }
          primaryButtonName={'Save'}
          secondaryButtonName={'Cancel'}
        />
      )}

      <main className="px-4 py-6 md:px-8 w-full max-w-screen-xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/admin/users" className="text-gray-700">
            <ChevronLeft className='hover:opacity-65 active:opacity-50'/>
          </Link>
        </div>

        {/* Scrollable Table */}
        <div className="w-full overflow-x-auto rounded-md shadow-lg border border-gray-300">
          <h1 className="md:text-center bg-gray-100 p-4 text-2xl font-bold text-green-900">Unverified Users</h1>
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
                      <p className='text-lg text-gray-500'>No unverified user yet.</p>
                    </td>
                  </tr>
                )
                : unverifiedUsers.map((user, index) => (
                    <tr
                      title={`Click to see profile of ${user.full_name}`} 
                      key={user.id} 
                      className='hover:bg-gray-100 cursor-pointer hover:shadow-inner shadow-sm' 
                      onClick={() => {
                        setModalType('user-profile');
                        setSelectedUser(user);
                        handleRowClick(user.user_uuid);
                      }}
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">{user.full_name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-500">{dateFormatter(user.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-4">
                          <button
                            title={`Verify ${user.full_name}?`}
                            onClick={(e) => {
                              setModalType('confirmation');
                              handleVerifyClick(e);
                              setSelectedUser(user);
                              setIsVerifyClicked(true);
                              navigate(`/admin/users/unverified/${user.user_uuid}`);
                            }}
                            className="flex items-center justify-center bg-gradient-to-br from-green-800 to-green-500 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50 transition cursor-pointer">
                            <ShieldCheck className='mr-1' size={20}/>
                            Verify
                          </button>
                          <button
                            title={`Delete ${user.full_name}?`}
                            onClick={(e) => handleDeleteClick(e)}
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
    </AdminLayout>
  );
};

export default AdminUnverifiedUsers;
