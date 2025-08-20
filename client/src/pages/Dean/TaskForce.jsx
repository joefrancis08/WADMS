import PATH from '../../constants/path';
import { Link2, Plus, Search, UserRoundCog, UserRoundPlus, UserRoundX } from 'lucide-react';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { useVerifiedUsers } from '../../hooks/useVerifiedUsers';
import VerifiedUserSkeletonLoader from '../../components/Loaders/VerifiedUserSkeletonLoader';
import getProfilePicPath from '../../utils/getProfilePicPath';
import TaskForceCard from '../../components/Form/Dean/TaskForceCard';
import TaskForceModal from '../../components/Form/Dean/TaskForceModal';

const TaskForce = () => {
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
  
  const taskForceData = [
    { data: taskForceChair, label: "Chair" },
    { data: taskForceMember, label: "Member" }
  ];

  return (
    <AdminLayout>
      <div className='flex-1 p-0 space-y-3'>
        {/* Main Content Header */}
        <div className='max-md:pt-2 md:sticky top-0 md:z-1 bg-gradient-to-r from-slate-900 to-green-500 shadow-md'>
          <div className='flex justify-between items-center p-4'>
            <div className='relative flex items-center'>
              <UserRoundCog className='text-slate-100' size={36} color='white'/>
              <p className='ml-2 mt-1 text-slate-100 text-3xl font-bold transition-all ease-in-out duration-300'>
                Task Force
              </p>
            </div>
            <div className='flex items-center'>
              <button
                title='Generate Access Link' 
                className='p-2 rounded-full mr-2 cursor-pointer hover:bg-green-700 active:opacity-50'>
                <Link2 className='text-white' size={32}/>
              </button>
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
            {/* This code avoid duplication of 90% of the data passes to the TaskForceCard component */}
            {taskForceData.map(({ data, label }) => (
              data.length > 0 && (
                <TaskForceCard
                  key={label}
                  activeDropdownId={activeDropdownId}
                  label={label}
                  taskForce={data}
                  navigation={(user) => navigate(TASK_FORCE_DETAIL(user.user_uuid))}
                  profilePic={(user) => getProfilePicPath(user.profile_pic_path)}
                  handleDropdown={handleDropdown}
                  handleEllipsisClick={handleEllipsisClick}
                />
              )
            ))}

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
      <TaskForceModal
        modalType={modalType}
        formValue={formValue}
        updatedValue={updatedValue}
        selectedUser={selectedUser}
        infoClick={infoClick}
        isUpdateBtnDisabled={isUpdateBtnDisabled}
        handlers={{
          handleCloseModal,
          handleInfoClick,
          handleProfilePic,
          setProfilePic,
          handleProfilePicUpdate,
          setUpdatedProfilePic,
          handleAddUserInputChange,
          handleSaveAdded,
          handleChange,
          handleSaveUpdate,
          handleChevronClick,
          handleDropdownMenuClick,
          toggleDropdown,
          handleConfirmDelete,
        }}
      />
    </AdminLayout>
  );
};

export default TaskForce;