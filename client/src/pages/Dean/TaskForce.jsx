import PATH from '../../constants/path';
import MODAL_TYPE from '../../constants/modalTypes';
import { BookUser, CircleQuestionMark, EllipsisVertical, Info, Pen, Plus, Search, ShieldCheck, ShieldX, Trash, Trash2, UserRound, UserRoundPlus, UserRoundX, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../../components/ProfileAvatar';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { useVerifiedUsers } from '../../hooks/useVerifiedUsers';
import Dropdown from '../../components/Dropdown/Dropdown';
import VerifiedUserSkeletonLoader from '../../components/Loaders/VerifiedUserSkeletonLoader';
import UpdateUserModal from '../../components/Modals/UpdateUserModal';
import UpdateField from '../../components/Form/Dean-and-Chairman/UpdateField';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import AddUserModal from '../../components/Modals/AddUserModal';
import AddField from '../../components/Form/Dean-and-Chairman/AddField';
import { emailRegex } from '../../utils/regEx';

const TaskForce = () => {
  const { TASK_FORCE_DETAIL } = PATH.DEAN
 
  const { 
    chevron, data, confirmDelete, dropdown, ellipsis, form, info, modal, 
    navigation, saveButton, state, user, userAdd, 
    userUpdate, 
  } = useVerifiedUsers();

  const { handleChevronClick } = chevron;
  const { verifiedUsers } = data;
  const { handleConfirmDelete } = confirmDelete;
  const { activeDropdownId, handleDropdown, handleDropdownMenuClick, toggleDropdown } = dropdown;
  const { handleEllipsisClick } = ellipsis;
  const { updatedValue, handleChange } = form;
  const { infoClick, handleInfoClick } = info;
  const { modalType, handleCloseModal } = modal;
  const { navigate } = navigation;
  const { isDisabled } = saveButton;
  const { loading, error } = state;
  const { selectedUser } = user;
  const { formValue, handleAddUser, handleAddUserInputChange, handleSaveAdded } = userAdd;
  const { handleSaveUpdate } = userUpdate;
  
  // Separate users by role
  const chairmanUsers = verifiedUsers.filter(u => u.role === 'Chairman');
  const memberUsers = verifiedUsers.filter(u => u.role === 'Faculty');

  const renderDropdown = (user) => {
    const dropDownMenu = [
      { icon: <UserRound size={22} />, label: 'Assign as Task Force' },
      { icon: <BookUser size={20} />, label: 'View Details' },
      { icon: <Pen size={18} />, label: 'Update' },
      { icon: <Trash2 size={20} color='red'/>, label: 'Delete' }
    ];

    return (
      activeDropdownId === user.id && (
        <div className='absolute top-8 left-22 max-sm:left-10 transition'>
          <Dropdown width={'w-35'} border={'border border-gray-300 rounded-md'}>
            {dropDownMenu.map((menu, index) => (
              <div
                onClick={(e) => handleDropdown(e, menu, user)}
                key={index}
                className={`flex items-center text-gray-700 text-sm p-2 rounded hover:bg-gray-100 hover:font-medium hover:shadow hover:transition ${menu.label === 'Delete' && 'border-t border-gray-300 mt-2'}`}
              >
                <i className='mr-2'>{menu.icon}</i>
                <p className={menu.label === 'Delete' ? 'text-red-500' : ''}>{menu.label}</p>
              </div>
            ))}
          </Dropdown>
        </div>
      )
    );
  };

  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPE.ADD_USER:
        return (
          <AddUserModal 
            onClose={() => handleCloseModal({isForAddUser: true, untoggleDropdown: true, clearForm: true})}
            onCancel={() => handleCloseModal({isForAddUser: true, untoggleDropdown: true, clearForm: true})}
            onSaveAdded={handleSaveAdded}
            primaryButton={'Add'}
            disabled={
              formValue.fullName.trim() === '' ||
              formValue.email.trim() === '' ||
              formValue.role.trim() === '' ||
              !emailRegex.test(formValue.email)
            }
            secondaryButton={'Cancel'}
            headerContent={
              <div className='relative flex items-center transition-all duration-300'>
                <p className='mr-2 text-2xl font-bold text-gray-800'>Add Task Force</p>
                <CircleQuestionMark 
                  onClick={handleInfoClick}
                  className='text-slate-500 hover:text-slate-600 cursor-pointer' size={20}
                />
                {infoClick && (
                  <div onClick={handleInfoClick} className='w-40 h-auto bg-slate-800 absolute top-3 left-52 rounded z-40 transition-opacity duration-500'>
                    <p className='text-slate-100 text-xs p-2'>
                      When you add user, their status will be Verified and their password will be like 'fullname0@wdms'.
                    </p>
                  </div>
                )}
              </div>
            }
            bodyContent={
              <>
                <AddField fieldName='Full Name' type='text' name='fullName' formValue={formValue.fullName} onChange={handleAddUserInputChange} />
                <AddField fieldName='Email Address' type='text' name='email' formValue={formValue.email} onChange={handleAddUserInputChange} />
                <AddField fieldName='Role' type='text' name='role' formValue={formValue.role} toggleDropdown={toggleDropdown} isReadOnly={true} isDropdown={true} isClickable={true} onChevronClick={handleChevronClick} onClick={handleChevronClick} onDropdownMenuClick={handleDropdownMenuClick} onChange={handleAddUserInputChange} />
              </>
            }
          />
        );
      case MODAL_TYPE.UPDATE_USER:
        return (
          <UpdateUserModal 
            onClose={() => handleCloseModal({untoggleDropdown: true, removeSelectedUser: true})}
            onCancelClick={() => handleCloseModal({untoggleDropdown: true, removeSelectedUser: true})}
            onSaveClick={handleSaveUpdate}
            headerContent={`Update ${selectedUser?.full_name}'s Info`}
            primaryButton={'Save Update'}
            disabled={isDisabled}
            secondaryButton={'Cancel'}
            bodyContent={
              <>
                <UpdateField fieldName='Full Name' type='text' name='fullName' formValue={updatedValue.fullName} onChange={handleChange} />
                <UpdateField fieldName='Email Address' type='text' name='email' formValue={updatedValue.email} onChange={handleChange} />
                <UpdateField fieldName='Role' type='text' name='role' formValue={updatedValue.role} onClick={handleChevronClick} onChevronClick={handleChevronClick} onDropdownMenuClick={handleDropdownMenuClick} toggleDropdown={toggleDropdown} isReadOnly={true} isClickable={true} hasDropdown={true} />
              </>
            }
          />
        );
      case MODAL_TYPE.USER_DELETION_CONFIRMATION:
        return (
          <ConfirmationModal 
            onClose={() => handleCloseModal({removeActiveDropdownId: true, removeSelectedUser: true})}
            onCancelClick={() => handleCloseModal({removeActiveDropdownId: true, removeSelectedUser: true})}
            onConfirmClick={() => handleConfirmDelete(selectedUser?.user_uuid)}
            isDelete={true}
            primaryButton={'Confirm'}
            secondaryButton={'Cancel'}
            headerContent={<p className="text-2xl font-bold text-red-600">Confirm Delete</p>}
            bodyContent={<p className='pb-4'>Are you sure you want to delete {selectedUser?.full_name}?</p>}
          />
        );
      default:
        return null;
    }
  }

  return (
    <AdminLayout>
      <div className='flex-1 p-0 space-y-3'>
        {/* Main Content Header */}
        <div className='max-md:pt-2 md:sticky top-0 md:z-1 bg-slate-100 shadow-sm'>
          <div className='flex justify-between items-center p-3'>
            <div className='relative flex items-center'>
              <UserRound size={36} color='green'/>
              <ShieldCheck className='absolute top-4 left-5' color='green' size={20} fill='white'/>
              <p className='ml-2 mt-1 text-green-900 text-3xl font-bold transition-all ease-in-out duration-300'>
                Task Force
              </p>
            </div>
            <div className='flex items-center md:gap-5'>
              <button title='Add User' onClick={handleAddUser} className='opacity-65 hover:opacity-100 hover:drop-shadow-sm mr-2 cursor-pointer hover:bg-green-10'>
                <UserRoundPlus size={32}/>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className='relative px-4 flex justify-start'>
          <Search className='absolute inset-y-4 inset-x-8 opacity-50'/>
          <input
            name='search-bar'
            className='bg-white pl-14 text-md mt-1 max-sm:w-60 w-1/2 border rounded-full p-3 border-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 shadow focus:shadow-lg transition duration-300' 
            type='text' 
            placeholder='Search...' 
          />
        </div>

        {/* Display users grouped by role */}
        {loading ? (
          <VerifiedUserSkeletonLoader />
        ) : (
          <div className='px-3 pb-4 space-y-6'>
            {/* Chairman Section */}
            {chairmanUsers.length > 0 && (
              <div>
                <div className='relative'>
                  <h2 className='p-2 text-2xl bg-green-600 shadow-md text-slate-100 rounded text-center font-bold mb-3'>{chairmanUsers.length > 1 ? 'Chairs' : 'Chair'}</h2>
                  <Plus className='absolute top-2.5 right-4 text-slate-100 cursor-pointer opacity-90 hover:opacity-100 hover:bg-slate-100 hover:text-green-700 rounded-full transition-all active:opacity-50' size={26}/>
                </div>
                <div className='flex flex-wrap justify-center gap-10 pb-6'>
                  {chairmanUsers.map(user => (
                    <div
                      onClick={() => navigate(TASK_FORCE_DETAIL(user.user_uuid))}
                      key={user.user_uuid} 
                      className='relative w-45 sm:w-50 md:w-55 lg:w-60 xl:w-65 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow hover:shadow-xl cursor-pointer transition'
                    >
                      <div onClick={(e) => handleEllipsisClick(e, user)} className='absolute top-0 p-2 right-0 text-gray-500 rounded-bl-xl rounded-tr-lg hover:shadow hover:text-gray-600 hover:bg-gray-200 active:opacity-50 transition'>
                        <EllipsisVertical size={20}/>
                      </div>
                      {renderDropdown(user)}
                      <div className='flex flex-col items-center text-center'>
                        <ProfileAvatar name={user.full_name} height='h-24' width='w-24' border='rounded-full' />
                        <h3 className='text-lg font-semibold mt-3'>{user.full_name}</h3>
                        <p className='text-sm text-gray-500'>{user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Faculty Section */}
            {memberUsers.length > 0 && (
              <div>
                <div className='relative'>
                  <h2 className='p-2 text-2xl bg-green-700 shadow-md text-slate-100 rounded text-center font-bold mb-3'>{memberUsers.length > 1 ? 'Members' : 'Member'}</h2>
                  <Plus className='absolute top-2.5 right-4 text-slate-100 cursor-pointer opacity-90 hover:opacity-100 hover:bg-slate-100 hover:text-green-700 rounded-full transition-all active:opacity-50' size={26}/>
                </div>
                <div className='flex flex-wrap justify-center gap-10 pb-6'>
                  {memberUsers.map(user => (
                    <div
                      onClick={() => navigate(TASK_FORCE_DETAIL(user.user_uuid))}
                      key={user.user_uuid} 
                      className='relative w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow hover:shadow-xl cursor-pointer transition'
                    >
                      <div onClick={(e) => handleEllipsisClick(e, user)} className='absolute top-0 p-2 right-0 text-gray-500 rounded-bl-xl rounded-tr-lg hover:shadow hover:text-gray-600 hover:bg-gray-200 active:opacity-50 transition'>
                        <EllipsisVertical size={20}/>
                      </div>
                      {renderDropdown(user)}
                      <div className='flex flex-col items-center text-center'>
                        <ProfileAvatar name={user.full_name} height='h-24' width='w-24' border='rounded-full' />
                        <h3 className='text-lg font-semibold mt-3'>{user.full_name}</h3>
                        <p className='text-sm text-gray-500'>{user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && chairmanUsers.length === 0 && memberUsers.length === 0 && (
              <div className='flex flex-col items-center justify-center mt-16 text-slate-700'>
                <UserRoundX className='w-40 md:w-60 h-auto' />
                <p className='text-xl md:text-2xl font-medium text-slate-600'>No Added Task Force.</p>
                <button onClick={handleAddUser} className='flex items-center gap-1 text-md md:text-xl font-medium bg-slate-400 text-slate-100 rounded-full mt-8 py-2 px-3 md:py-2 md:px-6 shadow cursor-pointer hover:transition-all hover:duration-300 hover:text-slate-800 hover:opacity-90 hover:bg-slate-300 hover:drop-shadow-lg active:opacity-50'>
                  <UserRoundPlus className='w-6 md:w-8 h-auto'/>
                  Add
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {renderModal()}
    </AdminLayout>
  );
};

export default TaskForce;