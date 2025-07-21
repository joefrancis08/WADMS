import { useState, useEffect} from 'react';
import SidebarLG from '../../components/SidebarLG';
import Icons from '../../assets/icons';
import SidebarSM from '../../components/SidebarSM';
import MobileHeader from '../../components/MobileHeader';
import { Link } from 'react-router-dom';

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
    { id: 7, name: 'Alice Johnson', role: 'Administrator', emoji: '👩‍💼' },
    { id: 8, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
    { id: 9, name: 'Alice Johnson', role: 'Administrator', emoji: '👩‍💼' },
    { id: 10, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
    { id: 11, name: 'Alice Johnson', role: 'Administrator', emoji: '👩‍💼' },
    { id: 12, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
    { id: 13, name: 'Alice Johnson', role: 'Administrator', emoji: '👩‍💼' },
    { id: 14, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
    { id: 15, name: 'Alice Johnson', role: 'Administrator', emoji: '👩‍💼' },
    { id: 16, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
    { id: 17, name: 'Alice Johnson', role: 'Administrator', emoji: '👩‍💼' },
    { id: 18, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
  ];

  const unverifiedUsers = [
    { id: 3, name: 'Charlie Brown', role: 'Guest', emoji: '👨‍🎓' },
    { id: 4, name: 'Dana White', role: 'Editor', emoji: '👩‍🏫' },
  ];

  const usersToDisplay = view === 'verified' ? verifiedUsers : unverifiedUsers;

  useEffect(() => {
    if (menuIsClicked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuIsClicked]);

  return (
    <>
      <div className='min-h-screen flex flex-col md:flex-row'>
        <div className='sm:flex max-md:flex md:hidden'>
          <SidebarSM sideBarOpen={menuIsClicked} setSideBarOpen={setMenuIsClicked} />
        </div>
        <div className='hidden md:block'>
          <SidebarLG />
        </div>

        {/* Mobile Header */}
        <MobileHeader onMenuClick={setMenuIsClicked}/>

        <div className='flex-1 p-0 space-y-3'>

          {/* Main Content Header */}
          <div className='max-md:pt-2 md:bg-gray-100 pb-2 md:py-3 md:shadow-md md:sticky top-0 md:z-1 bg-white'>
            <div className='flex justify-between items-center px-3'>
              <div className='flex items-center'>
                <img className='h-10 w-auto pr-2' src={Icons.verifiedUserDark} alt='' />
                <p className='text-2xl font-bold transition-all ease-in-out duration-300'>
                  {view === 'verified' ? 'Verified Users' : 'Unverified Users'}
                </p>
              </div>
              <div>
                <button className='cursor-pointer hover:bg-orange-50 hover:drop-shadow-sm p-1 rounded-md' title='Unverified User'>
                  <img className='opacity-65 hover:opacity-100 h-10 w-10' src={Icons.unverifiedUserDark} alt='' />
                </button>
              </div>
            </div>
          </div>

          {/* Toggle Buttons */}
          <div className='relative px-4 flex justify-between'>
            <img className='absolute inset-y-3.5 inset-x-8 h-8 w-8 opacity-50' src={Icons.searchIconDark} alt='' />
            <input 
              className='bg-white pl-14 text-md mt-1 max-sm:w-90 w-1/2 border rounded-full p-3 border-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 shadow focus:shadow-lg' 
              type='text' 
              placeholder='Search...' 
            />
          </div>
          
          

          {/* User Cards */}
          <div className='px-3 pb-10 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {usersToDisplay.map(user => (
              <div key={user.id} className='bg-gray-50 p-4 rounded-xl border border-gray-100 shadow hover:shadow-xl transition cursor-pointer'>
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
