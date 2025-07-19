import { useState } from 'react';
import SidebarLG from '../../components/SidebarLG';
import Icons from '../../assets/icons';
import SidebarSM from '../../components/SidebarSM';
import MobileHeader from '../../components/MobileHeader';

const AdminUsers = () => {
  const [menuIsClicked, setMenuIsClicked] = useState(false);
  const [view, setView] = useState('verified');

  const verifiedUsers = [
    { id: 1, name: 'Alice Johnson', role: 'Administrator', emoji: '👩‍💼' },
    { id: 2, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
    { id: 3, name: 'Alice Johnson', role: 'Administrator', emoji: '👩‍💼' },
    { id: 4, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
    { id: 5, name: 'Alice Johnson', role: 'Administrator', emoji: '👩‍💼' },
    { id: 6, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
  ];

  const unverifiedUsers = [
    { id: 3, name: 'Charlie Brown', role: 'Guest', emoji: '👨‍🎓' },
    { id: 4, name: 'Dana White', role: 'Editor', emoji: '👩‍🏫' },
  ];

  const usersToDisplay = view === 'verified' ? verifiedUsers : unverifiedUsers;

  return (
    <>
      <div className='min-h-screen flex flex-col md:flex-row'>
        <div className='sm:flex md:hidden'>
          <SidebarSM sideBarOpen={menuIsClicked} setSideBarOpen={setMenuIsClicked} />
        </div>
        <div className='hidden md:block'>
          <SidebarLG />
        </div>

        {/* Mobile Header */}
        <MobileHeader onMenuClick={setMenuIsClicked}/>
        <div className='flex-1 p-0 space-y-6'>
          {/* Breadcrumbs */}
          <div className=' pt-4 px-4 text-sm text-gray-500'>
            <span className='text-gray-600 cursor-pointer hover:underline'>Users</span> &gt;
            <span className='ml-1 font-semibold text-gray-700'>
              {view === 'verified' ? 'Verified Users' : 'Unverified Users'}
            </span>
          </div>

          {/* Header */}
          <div className='flex justify-between items-center px-4'>
            <h2 className='text-2xl font-bold'>
              {view === 'verified' ? 'Verified Users' : 'Unverified Users'}
            </h2>
            <span className='text-2xl'>📋</span>
          </div>

          {/* Toggle Buttons */}
          <div className='px-4 flex space-x-4'>
            <button
              className={`px-6 py-2 rounded-full font-medium ${
                view === 'verified' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setView('verified')}
            >
              ✅ Verified
            </button>
            <button
              className={`px-6 py-2 rounded-full font-medium ${
                view === 'unverified' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setView('unverified')}
            >
              ⚠️ Unverified
            </button>
          </div>

          {/* User Cards */}
          <div className='p-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {usersToDisplay.map(user => (
              <div key={user.id} className='bg-white p-4 rounded-xl shadow hover:shadow-lg transition'>
                <div className='flex flex-col items-center text-center'>
                  <div className='text-5xl mb-3'>{user.emoji}</div>
                  <h3 className='text-lg font-semibold'>{user.name}</h3>
                  <p className='text-sm text-gray-500'>{user.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
