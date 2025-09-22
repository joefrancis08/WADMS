import React from 'react';
import PATH from '../../constants/path';
import { Link2, Plus, UserRoundCog, UserRoundPlus, UserRoundX } from 'lucide-react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { useTaskForce } from '../../hooks/Dean/useTaskForce';
import VerifiedUserSkeletonLoader from '../../components/Loaders/VerifiedUserSkeletonLoader';
import getProfilePicPath from '../../utils/getProfilePicPath';
import TaskForceCard from '../../components/Dean/TaskForce/TaskForceCard';
import TaskForceModal from '../../components/Dean/TaskForce/TaskForceModal';
import ContentHeader from '../../components/Dean/ContentHeader';

const TaskForce = () => {
  const { TASK_FORCE_DETAIL } = PATH.DEAN;

  const { 
    chevron, data, confirmDelete, dropdown, ellipsis, form, info, modal, 
    navigation, profilePic, ref, saveButton, search, state, user, userAdd, 
    userUpdate, 
  } = useTaskForce();

  const { handleChevronClick } = chevron;
  const { taskForceChair, taskForceMember } = data;
  const { handleConfirmDelete } = confirmDelete;
  const { activeDropdownId, handleDropdown, handleDropdownMenuClick, toggleDropdown } = dropdown;
  const { handleEllipsisClick } = ellipsis;
  const { emailAlreadyExist, updatedValue, handleChange } = form;
  const { infoClick, handleInfoClick } = info;
  const { modalType, handleCloseModal } = modal;
  const { navigate } = navigation;
  const { setProfilePic, handleProfilePic, setUpdatedProfilePic, handleProfilePicUpdate } = profilePic;
  const { dropdownRef } = ref;
  const { isUpdateBtnDisabled } = saveButton;
  const { searchClick, handleSearchClick} = search;
  const { loading, error } = state;
  const { selectedUser } = user;
  const { formValue, handleAddUser, handleAddUserInputChange, handleSaveAdded } = userAdd;
  const { handleSaveUpdate } = userUpdate;
  
  const taskForceData = [
    { data: taskForceChair, label: "Chair" },
    { data: taskForceMember, label: "Member" }
  ];
  
  return (
    <DeanLayout>
      <div className='flex-1 p-0 space-y-3'>
        {/* Main Content Header */}
        <ContentHeader 
          headerIcon={UserRoundCog}
          headerTitle='Task Force'
          searchTitle='Search Task Force'
          placeholder='Search Task Force...'
          condition={taskForceChair.length > 0 || taskForceMember.length > 0}
          onClick={handleSearchClick}
        />
        <div className='relative px-4 flex justify-end'>
          <div className='flex items-center'>
            <button
              title='Generate Access Link' 
              className='p-2 rounded-full mr-2 cursor-pointer transition-all shadow bg-slate-300 hover:opacity-80 active:opacity-50'>
              <Link2 className='text-slate-700' size={32}/>
            </button>
            <button title='Create Task Force' onClick={handleAddUser} className='p-2 rounded-full mr-2 cursor-pointer transition-all shadow bg-slate-300 hover:opacity-80 active:opacity-50'>
              <UserRoundPlus className='text-slate-700' size={32}/>
            </button>
          </div>
        </div>
        
        {/* Display users grouped by role */}
        {loading ? (
          <VerifiedUserSkeletonLoader />
        ) : (
          <>
            {/* This code avoid duplication of 90% of the data passes to the TaskForceCard component */}
            <>
              {taskForceData.map(({ data, label }) => (
                data.length > 0 && (
                  <React.Fragment key={label}>
                    <div className='relative p-4 pt-15 space-y-6 mb-15 border bg-slate-800 shadow-md border-slate-300 rounded-lg mx-4 mt-8'>
                      <h2 className={`absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-1/2 p-2 text-2xl bg-gradient-to-l from-slate-900 via-green-600 to-slate-900 shadow-md max-lg:text-center text-slate-50 rounded font-bold border-b-2 border-slate-400`}>
                        {label 
                          ? (taskForceChair.length > 1 && taskForceMember.length > 1
                            ? `${String(label).toUpperCase()}S` : String(label).toUpperCase()) 
                          : ''
                        }
                      </h2>
                      <TaskForceCard
                        dropdownRef={dropdownRef}
                        key={label}
                        activeDropdownId={activeDropdownId}
                        label={label}
                        taskForce={data}
                        navigation={(user) => navigate(TASK_FORCE_DETAIL(user.user_uuid), { state: { fromSection: label } })}
                        profilePic={(user) => getProfilePicPath(user.profile_pic_path)}
                        handleDropdown={handleDropdown}
                        handleEllipsisClick={handleEllipsisClick}
                      />
                    </div>
                  </React.Fragment>
                )
              ))}
            </>
            {!loading && taskForceChair.length === 0 && taskForceMember.length === 0 && (
              <div className='flex flex-col items-center justify-center h-100'>
                <UserRoundX className='text-slate-700 w-40 md:w-60 h-auto' />
                <p className='text-lg md:text-xl font-medium text-slate-700'>
                  No data to display at the moment.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <TaskForceModal
        loading={loading}
        modalType={modalType}
        formValue={formValue}
        emailAlreadyExist={emailAlreadyExist}
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
    </DeanLayout>
  );
};

export default TaskForce;