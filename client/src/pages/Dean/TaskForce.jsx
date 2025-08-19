import PATH from '../../constants/path';
import MODAL_TYPE from '../../constants/modalTypes';
import { CircleQuestionMark, ContactRound, EllipsisVertical, FolderTree, Link, Pen, Plus, PlusCircle, Search, ShieldCheck, SquareUserRound, Trash2, UserRound, UserRoundCog, UserRoundPen, UserRoundPlus, UserRoundX } from 'lucide-react';
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
import ImageUpload from '../../components/Form/Upload/ImageUpload';
import ProfilePicture from '../../components/ProfilePicture';
import getProfilePicPath from '../../utils/getProfilePicPath';

const TaskForce = () => {
  const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;
  const { TASK_FORCE_DETAIL } = PATH.DEAN;

  const { 
    chevron, data, confirmDelete, dropdown, ellipsis, form, info, modal, 
    navigation, profilePic, saveButton, state, user, userAdd, 
    userUpdate, 
  } = useVerifiedUsers();

  const { handleChevronClick } = chevron;
  const { taskForceChair, taskForceMember } = data;
  const { handleConfirmDelete } = confirmDelete;
  const { activeDropdownId, handleDropdown, handleDropdownMenuClick, toggleDropdown } = dropdown;
  const { handleEllipsisClick } = ellipsis;
  const { updatedValue, handleChange } = form;
  const { infoClick, handleInfoClick } = info;
  const { modalType, handleCloseModal } = modal;
  const { navigate } = navigation;
  const { setProfilePic, handleProfilePic, setUpdatedProfilePic, handleProfilePicUpdate } = profilePic;
  const { isUpdateBtnDisabled } = saveButton;
  const { loading, error } = state;
  const { selectedUser } = user;
  const { formValue, handleAddUser, handleAddUserInputChange, handleSaveAdded } = userAdd;
  const { handleSaveUpdate } = userUpdate;
  
  // Separate users by role

  const renderDropdown = (user) => {
    const dropDownMenu = [
      { icon: <FolderTree size={20} />, label: 'Assign Program and Area' },
      { icon: <Link size={20} />, label: 'Generate Access Link' },
      { icon: <SquareUserRound size={20} />, label: 'View Details' },
      { icon: <UserRoundPen size={20} />, label: 'Update' },
      { icon: <Trash2 size={20} color='red'/>, label: 'Delete' }
    ];

    return (
      activeDropdownId === user.id && (
        <div className='absolute top-8 left-15 max-sm:left-10 transition'>
          <Dropdown width={'w-50'} border={'border border-gray-300 rounded-md'}>
            {dropDownMenu.map((menu, index) => (
              <div
                onClick={(e) => handleDropdown(e, menu, user)}
                key={index}
                className={`flex items-center text-gray-700 text-sm p-2 hover:first:rounded-t hover:last:rounded-b hover:bg-gray-100 hover:font-medium hover:shadow transition-all ${menu.label === 'Delete' && 'border-t border-gray-300 mt-2'}`}
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
            disabled={
              formValue.fullName.trim() === '' ||
              formValue.email.trim() === '' ||
              formValue.role.trim() === ''
            }
            primaryButton={'Add'}
            secondaryButton={'Cancel'}
            headerContent={
              <div className='relative flex items-center transition-all duration-300'>
                <p className='mr-2 text-2xl font-bold text-slate-700'>Add Task Force</p>
                <CircleQuestionMark 
                  onClick={handleInfoClick}
                  className='text-slate-500 hover:text-slate-600 cursor-pointer' size={20}
                />
                {infoClick && (
                  <div onClick={handleInfoClick} className='w-40 h-auto bg-slate-800 absolute top-3 left-52 rounded z-40 transition-opacity duration-500'>
                    <p className='text-slate-100 text-xs p-2'>
                      The "Add" button is enabled only if all mandatory fields (excluding the profile picture) are completed and the email is correctly formatted.
                    </p>
                  </div>
                )}
              </div>
            }
            bodyContent={
              <>
                <ImageUpload onChange={handleProfilePic} setProfilePic={setProfilePic}/>
                <AddField fieldName='Full Name' type='text' name='fullName' formValue={formValue.fullName} onChange={handleAddUserInputChange} />
                <AddField fieldName='Email Address' type='text' name='email' formValue={formValue.email} onChange={handleAddUserInputChange} />
                <AddField fieldName='Role' type='text' name='role' formValue={formValue.role} toggleDropdown={toggleDropdown} isReadOnly={true} isDropdown={true} isClickable={true} onChevronClick={handleChevronClick} onClick={handleChevronClick} onDropdownMenuClick={handleDropdownMenuClick} onChange={handleAddUserInputChange} />
                <hr className='text-gray-300 mt-2'></hr>
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
            headerContent={`Update ${selectedUser.full_name}'s Info`}
            primaryButton={'Save Update'}
            disabled={isUpdateBtnDisabled}
            secondaryButton={'Cancel'}
            bodyContent={
              <>
                <ImageUpload 
                  onChange={handleProfilePicUpdate}
                  setUpdatedProfilePic={setUpdatedProfilePic} 
                  imageValue={selectedUser?.profile_pic_path} 
                />
                <UpdateField fieldName='Full Name' type='text' name='fullName' formValue={updatedValue.fullName} onChange={handleChange} />
                <UpdateField fieldName='Email Address' type='text' name='email' formValue={updatedValue.email} onChange={handleChange} />
                <UpdateField fieldName='Role' type='text' name='role' formValue={updatedValue.role} onClick={handleChevronClick} onChevronClick={handleChevronClick} onDropdownMenuClick={handleDropdownMenuClick} toggleDropdown={toggleDropdown} isReadOnly={true} isClickable={true} hasDropdown={true} />
                <hr className='text-gray-300'></hr>
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
            primaryButton={'Delete'}
            secondaryButton={'Cancel'}
            bodyContent={
              <>
                <div className='flex flex-col justify-center'>
                  <div className='flex justify-center px-4'>
                    <div className='p-4 bg-red-400/20 rounded-full'>
                      <Trash2 className='text-red-500/80' size={24}/>
                    </div>
                  </div>
                  <div className='pb-6 pt-1'>
                    <p className='text-center text-xl text-red-500 font-medium'>
                      Delete
                    </p>
                  </div>
                  <div>
                    <p className='pb-6 text-lg text-slate-800 text-center'>
                      Are you sure you want to delete <span className='font-medium text-slate-900'>{selectedUser?.full_name}</span>?
                    </p>
                  </div>
                </div>
              </>
            }
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
        <div className='max-md:pt-2 md:sticky top-0 md:z-1 bg-gradient-to-r from-slate-900 to-green-500 shadow-md'>
          <div className='flex justify-between items-center p-3'>
            <div className='relative flex items-center'>
              <UserRoundCog className='text-slate-100' size={36} color='white'/>
              <p className='ml-2 mt-1 text-slate-100 text-3xl font-bold transition-all ease-in-out duration-300'>
                Task Force
              </p>
            </div>
            <div className='flex items-center md:gap-5'>
              <button title='Add Task Force' onClick={handleAddUser} className='p-2 rounded-full mr-2 cursor-pointer hover:bg-green-700 active:opacity-50 '>
                <UserRoundPlus className='text-white' size={32}/>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar (show if chair and member more than 0)*/}
        {(taskForceChair.length > 0 || taskForceMember.length > 0 ) && (
          <div className='relative px-4 flex justify-start'>
            <Search className='absolute inset-y-4 inset-x-8 opacity-50'/>
            <input
              name='search-bar'
              className='bg-white pl-14 text-md mt-1 max-sm:w-60 w-1/2 border rounded-full p-3 border-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 shadow focus:shadow-lg transition duration-300' 
              type='text' 
              placeholder='Search...' 
            />
          </div>
        )}
        
        {/* Display users grouped by role */}
        {loading ? (
          <VerifiedUserSkeletonLoader />
        ) : (
          <div className='px-3 pb-4 space-y-6'>
            {/* Chair Section */}
            {taskForceChair.length > 0 && (
              <div>
                <div className='flex justify-center'>
                  <h2 className='flex items-center justify-center w-full lg:w-[75%] gap-2 p-2 text-2xl bg-gradient-to-l from-slate-900 to-green-600 shadow-md max-lg:text-center text-slate-50 rounded font-bold mb-3'>
                    {taskForceChair.length > 1 ? 'CHAIRS' : 'CHAIR'}
                  </h2>
                </div>
                <div className='flex flex-wrap gap-10 pb-6 justify-center'>
                  {taskForceChair.map(user => (
                    <div
                      onClick={() => navigate(TASK_FORCE_DETAIL(user.user_uuid))}
                      key={user.user_uuid} 
                      className='relative w-45 sm:w-50 md:w-55 lg:w-60 xl:w-65 p-4 bg-gray-50 rounded-xl border border-slate-300 shadow hover:shadow-xl cursor-pointer transition'
                    >
                      <div onClick={(e) => handleEllipsisClick(e, user)} className='absolute top-0 p-2 right-0 text-gray-500 rounded-bl-xl rounded-tr-lg hover:shadow hover:text-gray-600 hover:bg-gray-200 active:opacity-50 transition'>
                        <EllipsisVertical size={20}/>
                      </div>
                      {renderDropdown(user)}
                      <div className='flex flex-col items-center text-center'>
                        <ProfilePicture
                          name={user.full_name} 
                          profilePic={getProfilePicPath(user.profile_pic_path)}
                          height='h-36' width='w-36' 
                          border='rounded-full border-3 border-green-700' />
                        <h3 className='text-lg font-semibold mt-3'>{user.full_name}</h3>
                        <p className='text-sm text-gray-500'>{user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member Section */}
            {taskForceMember.length > 0 && (
              <div>
                <div className='flex justify-center'>
                  <h2 className='flex justify-center p-2 text-2xl bg-gradient-to-l w-full from-slate-900 to-green-600 shadow-md max-lg:text-center text-slate-50 rounded font-bold mb-3'>
                    {taskForceMember.length > 1 ? 'MEMBERS' : 'MEMBER'}
                  </h2>
                </div>
                <div className='flex flex-wrap gap-10 pb-6 justify-center'>
                  {taskForceMember.map(user => (
                    <div
                      onClick={() => navigate(TASK_FORCE_DETAIL(user.user_uuid))}
                      key={user.user_uuid} 
                      className='relative w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56 p-4 bg-gray-50 rounded-xl border border-slate-300 shadow hover:shadow-xl cursor-pointer transition'
                    >
                      <div onClick={(e) => handleEllipsisClick(e, user)} className='absolute top-0 p-2 right-0 text-gray-500 rounded-bl-xl rounded-tr-lg hover:shadow hover:text-gray-600 hover:bg-gray-200 active:opacity-50 transition'>
                        <EllipsisVertical size={20}/>
                      </div>
                      {renderDropdown(user)}
                      <div className='flex flex-col items-center text-center'>
                        <ProfilePicture
                          name={user.full_name} 
                          profilePic={getProfilePicPath(user.profile_pic_path)}
                          height='h-28' width='w-28' 
                          border='rounded-full border-2 border-green-700' />
                        <h3 className='text-lg font-semibold mt-3'>{user.full_name}</h3>
                        <p className='text-sm text-gray-500'>{user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && taskForceChair.length === 0 && taskForceMember.length === 0 && (
              <div className='flex flex-col items-center justify-center mt-20 text-slate-700'>
                <UserRoundX className='w-40 md:w-60 h-auto' />
                <p className='text-xl md:text-2xl font-medium text-slate-600'>
                  No Task Force added at the moment.
                </p>
                <button onClick={handleAddUser} className='bg-slate-700 flex items-center gap-1 md:gap-2 text-md md:text-xl font-medium text-slate-100 rounded-full mt-8 py-2 px-3 pr-5 md:py-2 md:px-4 md:pr-6 shadow cursor-pointer hover:bg-slate-500 hover:transition-all hover:duration-300'>
                  <Plus className='w-6 md:w-7 h-auto'/>
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