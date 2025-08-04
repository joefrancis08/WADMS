import PATH from '../../constants/path';
import MODAL_TYPE from '../../constants/modalTypes';
import { USER_ROLES } from '../../constants/user';
import { BookUser, ChevronDown, EllipsisVertical, Pen, Search, ShieldCheck, ShieldX, Trash, Trash2, UserRound, UserRoundPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../../components/ProfileAvatar';
import AdminLayout from '../../components/Layout/Dean-and-Chairman/AdminLayout';
import { useVerifiedUsers } from '../../hooks/useVerifiedUsers';
import Dropdown from '../../components/Dropdown/Dropdown';
import VerifiedUserSkeletonLoader from '../../components/Loaders/VerifiedUserSkeletonLoader';
import UpdateUserModal from '../../components/Modals/UpdateUserModal';
import UpdateField from '../../components/Form/Dean-and-Chairman/UpdateField';

const VerifiedUsers = () => {
  const { UNVERIFIED_USERS, VERIFIED_USER_DETAIL } = PATH.ADMIN
 
  const { 
    chevron, data, dropdown, ellipsis, form, modal, 
    navigation, state, user, userUpdate, userCount 
  } = useVerifiedUsers();

  const { handleChevronClick } = chevron;
  const { verifiedUsers } = data;
  const { activeDropdownId, handleDropdown, handleDropdownMenuClick, toggleDropdown } = dropdown;
  const { handleEllipsisClick } = ellipsis;
  const { formValue, handleChange } = form;
  const { modalType, handleCloseModal } = modal;
  const { navigate } = navigation;
  const { loading, error } = state;
  const { selectedUser } = user;
  const { handleSaveUpdate } = userUpdate;
  const { unverifiedUserCount } = userCount;

  
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
                onClick={(e) => handleDropdown(e, menu, user)}
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

   const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPE.UPDATE_USER:
        return (
          <UpdateUserModal 
            onClose={handleCloseModal}
            onCancelClick={handleCloseModal}
            onSaveClick={handleSaveUpdate}
            headerContent={`Update ${selectedUser?.full_name}'s Info`}
            primaryButton={'Save Update'}
            secondaryButton={'Cancel'}
            bodyContent={
              <>
               <UpdateField 
                  fieldName='Full Name'
                  type='text'
                  name='fullName'
                  formValue={formValue.fullName}
                  onChange={(e) => handleChange(e)}
                />

                <UpdateField 
                  fieldName='Email'
                  type='text'
                  name='email'
                  formValue={formValue.email}
                  onChange={(e) => handleChange(e)}
                />

                <UpdateField 
                  fieldName='Role'
                  type='text'
                  name='role'
                  formValue={formValue.role}
                  onClick={handleChevronClick}
                  onChevronClick={handleChevronClick}
                  onDropdownMenuClick={handleDropdownMenuClick}
                  toggleDropdown={toggleDropdown}
                  isReadOnly={true}
                  isClickable={true}
                  hasDropdown={true}
                />
              </>
            }
          />
        );
      default:
        break;
    }
  }
 
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
              <Link to={UNVERIFIED_USERS}>
                <div className='relative mr-2'>
                  <button className='cursor-pointer opacity-65 hover:opacity-100 hover:drop-shadow-sm p-1 rounded-md transition duration-300' title='Unverified Users'>
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
              className='bg-white pl-14 text-md mt-1 max-sm:w-60 w-1/2 border rounded-full p-3 border-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 shadow focus:shadow-lg transition duration-300' 
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
                className='relative opacity-65 hover:opacity-100 hover:drop-shadow-sm mr-2 cursor-pointer hover:bg-green-10 transition duration-300'>
                <Trash color='red' size={28}/>
                <Users className='absolute top-3 left-2' size={12} color='red'/>
              </button>
            </div>
          </div>

          {/* User Cards */}
          {loading 
            ? (
                <VerifiedUserSkeletonLoader />
              )
            : (
                <div className='px-3 pb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6'>
                  {verifiedUsers.map(user => (
                    <div
                      onClick={() => navigate(VERIFIED_USER_DETAIL(user.user_uuid))}
                      key={user.user_uuid} 
                      className='relative bg-gray-50 p-4 rounded-xl border border-gray-100 shadow transition-all duration-300 hover:shadow-xl active:shadow cursor-pointer'>
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
              )
          }
        </div>
        {renderModal()}
      </AdminLayout>
    </>
  );
};

export default VerifiedUsers;
