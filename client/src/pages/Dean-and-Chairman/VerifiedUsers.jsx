
import { Link } from 'react-router-dom';
import { BookUser, EllipsisVertical, Pen, Search, ShieldCheck, ShieldX, Trash, Trash2, UserRound, UserRoundPlus, Users } from 'lucide-react';
import ProfileAvatar from '../../components/ProfileAvatar';
import AdminLayout from '../../components/Layout/Dean-and-Chairman/AdminLayout';
import { useVerifiedUsers } from '../../hooks/useVerifiedUsers';
import Dropdown from '../../components/Dropdown';


const VerifiedUsers = () => {
  const { userCount, ellipsis, dropdown, data } = useVerifiedUsers();

  const { unverifiedUserCount } = userCount;
  const { handleEllipsisClick } = ellipsis;
  const { activeDropdownId, setActiveDropdownId } = dropdown;
  const { verifiedUsers } = data;

  const renderDropdown = (user) => {
    const dropDownMenu = [
      {
        icon: <BookUser size={20} />,
        label: 'View Details'
      },
      {
        icon: <Pen size={18} />,
        label: 'Update'
      },
      {
        icon: <Trash2 size={20} color='red'/>,
        label: 'Delete'
      }
    ];

    return (
      activeDropdownId === user.id && (
        <div className='absolute top-8 left-24 max-sm:left-10 transition'>
          <Dropdown 
            width={'w-35'} 
            border={'border border-gray-300 rounded-md'}>
            {dropDownMenu.map((menu, index) => (
              <div
                onClick={() => {
                  if (menu.label === 'Update') console.log('Update');
                  else if (menu.label === 'View Details') console.log('View Details');
                  else if (menu.label === 'Delete') console.log('Delete');
                }}
                key={index}
                className={`flex text-gray-700 text-sm p-2 opacity-100 rounded hover:bg-gray-100 hover:font-medium hover:shadow hover:transition active:opacity-50 ${menu.label === 'Delete' && 'border-t border-gray-300 rounded-t-none mt-2'}`}

              >
                <i className='mr-2'>{menu.icon}</i>
                <p className={menu.label === 'Delete' ? 'text-red-500' : ''}>
                  {menu.label}
                </p>
              </div>
            ))}
          </Dropdown>
        </div>     
      )
    );
  };

  
 
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
          <div className='px-3 pb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6'>
            {verifiedUsers.map(user => (
              <div
                key={user.user_uuid} 
                className='relative bg-gray-50 p-4 rounded-xl border border-gray-100 shadow hover:shadow-xl transition cursor-pointer'>
                <div 
                  onClick={(e) => handleEllipsisClick(e, user)} 
                  className='absolute top-0 p-2 right-0 text-gray-500 rounded-bl-xl rounded-tr-lg hover:shadow hover:text-gray-600 hover:bg-gray-200 active:opacity-50 transition'>
                    <EllipsisVertical size={20}/>
                </div>
                {renderDropdown(user)}
                <div className='flex flex-col items-center text-center'>
                  <div className='text-5xl mb-3'>
                    {<ProfileAvatar name={user.full_name} height={'h-24'} width={'w-24'} border={'rounded-full'}/>}
                  </div>
                  <h3 className='text-lg font-semibold'>{user.full_name}</h3>
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
