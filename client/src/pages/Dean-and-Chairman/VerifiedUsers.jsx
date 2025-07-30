import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, ShieldX, Trash, UserRound, UserRoundPlus, Users } from 'lucide-react';
import { useUsersByRole } from '../../hooks/useUsers';
import ProfileAvatar from '../../components/ProfileAvatar';
import { USER_ROLES } from '../../constants/user';
import AdminLayout from '../../components/Layout/Dean-and-Chairman/AdminLayout';


const VerifiedUsers = () => {
  const { users } = useUsersByRole(USER_ROLES.DEFAULT);
  const [unverifiedUserCount, setUnverifiedUserCount] = useState(0);

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
    { id: 19, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
    { id: 20, name: 'Alice Johnson', role: 'Administrator', emoji: '👩‍💼' },
    { id: 21, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
    { id: 22, name: 'Alice Johnson', role: 'Administrator', emoji: '👩‍💼' },
    { id: 23, name: 'Bob Smith', role: 'Moderator', emoji: '👨‍💻' },
  ];

  useEffect(() => {
  // Only run this if users is an array (not loading or error)
  if (Array.isArray(users?.data)) {
      const count = users.data.length;
      setUnverifiedUserCount(count);
    }
  }, [users]);

  return (
    <>
      <AdminLayout>
        <div className='flex-1 p-0 space-y-3'>
          {/* Main Content Header */}
          <div className='max-md:pt-2 md:bg-gradient-to-r from-gray-100 to-gray-200 pb-2 md:py-4 md:shadow-md md:sticky top-0 md:z-1 bg-white'>
            <div className='flex justify-between items-center px-3'>
              <div className='relative flex items-center'>
                <UserRound size={36} color='green'/>
                <ShieldCheck className='absolute top-4 left-5' color='green' size={20} fill='white'/>
                <p className='ml-2 mt-1 text-green-900 text-2xl font-bold transition-all ease-in-out duration-300'>
                  Verified Users
                </p>
              </div>
              <Link to='/admin/unverified-users'>
                <div className='relative mr-2'>
                  <button className='cursor-pointer opacity-65 hover:opacity-100 hover:drop-shadow-sm p-1 rounded-md' title='Unverified Users'>
                    <UserRound size={36} color='#004030'/>
                    <div className='absolute left-6 top-6'>
                      <ShieldX color='red' size={20} fill='white'/>
                    </div>
                  </button>
                  {unverifiedUserCount > 0 && (
                    <div className='absolute left-7 top-0'>
                      <p className='text-[11px] font-bold px-2 text-white bg-red-600 rounded-4xl'>
                        {unverifiedUserCount}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </div>

          {/* Toggle Buttons */}
          <div className='relative px-4 flex justify-between'>
            <Search className='absolute inset-y-4 inset-x-8 opacity-50'/>
            <input
              name='search-bar'
              className='bg-white pl-14 text-md mt-1 max-sm:w-60 w-1/2 border rounded-full p-3 border-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 shadow focus:shadow-lg' 
              type='text' 
              placeholder='Search...' 
            />
            <div className='flex items-center md:gap-5'>
              <button 
                title='Add User'
                className='opacity-65 hover:opacity-100 hover:drop-shadow-sm mr-2 cursor-pointer hover:bg-green-10'>
                <UserRoundPlus size={28}/>
              </button>
              <button 
                title='Delete all users'
                className='relative opacity-65 hover:opacity-100 hover:drop-shadow-sm mr-2 cursor-pointer hover:bg-green-10'>
                <Trash color='red' size={28}/>
                <Users className='absolute top-3 left-2' size={12} color='red'/>
              </button>
            </div>
          </div>

          {/* User Cards */}
          <div className='px-3 pb-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {verifiedUsers.map(user => (
              <div key={user.id} className='bg-gray-50 p-4 rounded-xl border border-gray-100 shadow hover:shadow-xl transition cursor-pointer'>
                <div className='flex flex-col items-center text-center'>
                  <div className='text-5xl mb-3'>
                    {<ProfileAvatar name={user.name} height={'h-24'} width={'w-24'} border={'rounded-full'}/>}
                  </div>
                  <h3 className='text-lg font-semibold'>{user.name}</h3>
                  <p className='text-sm text-gray-500'>{user.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default VerifiedUsers;
