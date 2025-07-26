import { useState, useEffect } from 'react';
import { ChevronLeft, ShieldCheck, Trash2, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import dateFormatter from '../../utils/dateFormatter';
import { useUsers } from '../../hooks/useUsers';
import ProfileAvatar from '../../components/ProfileAvatar';
import UserProfileModal from '../../components/UserProfileModal';

const AdminUnverifiedUsers = () => {
  const navigate = useNavigate();
  const { users, loading, error} = useUsers();
  const unverifiedUsers = users?.data ?? [];
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const UserProfileHeader = () => {
    return (
      <>
        {/* Close Button */}
        <button
          onClick={() => {
            setSelectedUser(null);
            navigate('/admin/users/unverified');
          }}
          className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          aria-label="Close"
        >
          <X />
        </button>

        {/* Header */}
        <div className='w-full flex flex-col md:flex-row rounded items-center justify-center py-5 border border-gray-200 shadow-md'>
          <div>
            <ProfileAvatar name={selectedUser.full_name} height={'md:h-36 h-32'} width={'md:w-36 w-32'} border={'rounded-full'}/>
          </div>
          <div className='relative p-4 flex'>
            <p className=" border border-gray-200 rounded-md p-4 text-xl md:text-2xl font-bold text-green-900 mt-2 shadow-sm bg-gray-100">
              {selectedUser.full_name}
            </p>
          </div>
        </div>
      </>    
    )
  }

  const UserProfileDetails = () => {
    return (
      <>
        <div className='relative p-4 flex'>
          <span className='text-white text-xs absolute top-3 md:left-1/2 left-1/2 -translate-x-11 md:-translate-x-11 mb-2 bg-green-700 py-1 px-2 rounded-md'>Email Address</span>
          <p className=" border border-gray-300 rounded-lg p-4 text-md font-bold text-green-900 mt-2 shadow-inner bg-gray-100">
            {selectedUser.email}
          </p>
        </div>
        <div className='relative p-4 flex'>
          <span className='text-white text-xs text-center absolute top-3 md:left-1/2 left-1/2 -translate-x-22 md:-translate-x-22 mb-2 bg-green-700 py-1 px-4 w-45 rounded-md'>Registration Date & Time</span>
          <p className="flex border border-gray-300 rounded-lg p-4 text-md font-semibold text-green-900 mt-2 shadow-inner bg-gray-100">
            {dateFormatter(selectedUser.created_at)}
          </p>
        </div>
      </> 
    )
  }

  const UserProfileAction = () => {
    return (
      <>
        <button className='flex items-center justify-center bg-gradient-to-br from-red-800 to-red-500 text-white px-6 md:px-10 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-red-800 hover:to-red-500 hover:shadow-lg active:opacity-50 transition cursor-pointer'>
          <Trash2 className='mr-1'/>
          Delete
        </button>
        <button className='flex items-center justify-center bg-gradient-to-br from-green-800 to-green-500 text-white px-6 md:px-10 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50 transition cursor-pointer'>
          <ShieldCheck className='mr-1'/>
          Verify
        </button>
      </>
    )
  }

  return (
    <AdminLayout>
      {selectedUser && 
          <UserProfileModal
            onClose={() => {
              setSelectedUser(null);
            }}
            header={<UserProfileHeader />}
            body={<UserProfileDetails />}
            footer={<UserProfileAction />}
            modalOpen={modalOpen}
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
                        setSelectedUser(user);
                        setModalOpen(true);
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
                            onClick={(e) => handleVerifyClick(e)}
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
