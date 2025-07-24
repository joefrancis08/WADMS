import { useState, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ShieldCheck, Trash, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import dateFormatter from '../../utils/dateFormatter';
import { useUsers } from '../../hooks/useUsers';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminUnverifiedUsers = () => {
  const navigate = useNavigate();
  const { users, loading, error} = useUsers();
  const unverifiedUsers = users.data;
  const [selectedUser, setSelectedUser] = useState(null);

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

  const usersMockup = [
    { id: 1, profileImage: '👩', name: "Alice Santos", email: "alice.santos@example.com", status: "Active", role: "Admin", createdAt: "2025-07-20 10:27:02" },
    { id: 2, profileImage: '🧑', name: "Brandon Cruz", email: "brandon.cruz@example.com", status: "Inactive", role: "User", createdAt: "2025-07-20 10:27:02" },
    { id: 3, profileImage: '👩', name: "Carla Domingo", email: "carla.domingo@example.com", status: "Pending", role: "Moderator", createdAt: "2025-07-20 10:27:02" },
    { id: 4, profileImage: '🧑', name: "Daniel Reyes", email: "daniel.reyes@example.com", status: "Active", role: "User", createdAt: "2025-07-20 10:27:02" },
    { id: 5, profileImage: '👩', name: "Erika Mendoza", email: "erika.mendoza@example.com", status: "Suspended", role: "User", createdAt: "2025-07-20 10:27:02" },
  ];

  return (
    <AdminLayout>
      {console.log(unverifiedUsers)}
      <main className="px-4 py-6 md:px-8 w-full max-w-screen-xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/admin/users" className="text-gray-700">
            <ChevronLeft className='hover:opacity-65 active:opacity-50'/>
          </Link>
        </div>

        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 animate-fadeIn">
              {/* Close Button */}
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Header */}
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2">
                👤 User Info
              </h2>

              {/* User Info */}
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Name:</span> {selectedUser.full_name}</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Email:</span> {selectedUser.email}</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Status:</span> {selectedUser.status}</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Role:</span> {selectedUser.role}</p>
                <p><span className="font-medium text-gray-600 dark:text-gray-400">Registered:</span> {dateFormatter(selectedUser.created_at)}</p>
              </div>
            </div>
          </div>

        )}


        {/* Scrollable Table */}

        <div className="w-full overflow-x-auto rounded-md shadow-lg border border-gray-300">
          <h1 className="md:text-center p-4 text-2xl font-semibold text-green-900">Unverified Users</h1>
          <table className="min-w-[700px] w-full">
            <thead className="bg-gray-300 text-gray-700 text-sm font-semibold border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Registration Date & Time</th>
                <th className="px-6 py-3 text-center">Quick Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {
                !unverifiedUsers
                ? <tr><td>No unverified user yet.</td></tr>
                : unverifiedUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className='hover:bg-gray-100 cursor-pointer hover:shadow-inner shadow-sm' 
                      onClick={() => (setSelectedUser(user), handleRowClick(user.user_uuid))}
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">{user.full_name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-500">{dateFormatter(user.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-4">
                          <button 
                            onClick={(e) => handleVerifyClick(e)}
                            className="flex item-center justify-center bg-green-800 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 hover:shadow-md active:bg-green-500 transition cursor-pointer">
                            <ShieldCheck className='mr-1' size={20}/>
                            Verify
                          </button>
                          <button onClick={(e) => handleDeleteClick(e)}>
                            <Trash2 className='text-red-600 hover:text-red-500 active:text-red-300 transition hover:drop-shadow-lg cursor-pointer' fill='red' fillOpacity={0.1}/>
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
