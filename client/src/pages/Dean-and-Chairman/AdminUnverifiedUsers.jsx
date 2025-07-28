import { useState, useEffect } from 'react';
import { ChevronLeft, ShieldCheck, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import dateFormatter from '../../utils/dateFormatter';
import { useUsers } from '../../hooks/useUsers';
import Modal from '../../components/Layout/ModalLayout';
import UserProfileModal from '../../components/Modals/UserProfileModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';

const AdminUnverifiedUsers = () => {
  const navigate = useNavigate();
  const { users, loading, error} = useUsers();
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isVerifyClicked, setIsVerifyClicked] = useState(false);
  const [modalType, setModalType] = useState(null);

  const unverifiedUsers = users?.data ?? [];

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

  return (
    <AdminLayout>
      {modalType === 'confirmation' && isVerifyClicked && (
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
            navigate('/admin/users/unverified');
          }}
        />
      )}

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
