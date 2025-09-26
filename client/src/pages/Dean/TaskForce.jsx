import React, { useState } from 'react';
import PATH from '../../constants/path';
import { Search, UserRoundPlus, UserRoundX } from 'lucide-react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { useTaskForce } from '../../hooks/Dean/useTaskForce';
import VerifiedUserSkeletonLoader from '../../components/Loaders/VerifiedUserSkeletonLoader';
import getProfilePicPath from '../../utils/getProfilePicPath';
import TaskForceCard from '../../components/Dean/TaskForce/TaskForceCard';
import TaskForceModal from '../../components/Dean/TaskForce/TaskForceModal';
import ContentHeader from '../../components/Dean/ContentHeader';
import { searchUser } from '../../assets/icons';

const { TASK_FORCE_DETAIL } = PATH.DEAN;
const cardNav = [
  { id: 'all', label: 'All' },
  { id: 'chairs', label: 'Chairs' },
  { id: 'members', label: 'Members' }
];

const TaskForce = () => {
  const { navigate, refs, states, datas, handlers } = useTaskForce();

  const { dropdownRef } = refs;

  const {
    activeDropdownId,
    setActiveDropdownId,
    toggleDropdown,
    setProfilePic,
    setUpdatedProfilePic,
  } = states;

  const { 
    taskForceChair,
    taskForceMember,
    updatedValue,
    emailAlreadyExist,
    modalType,
    modalData,
    isUpdateBtnDisabled,
    loading,
    selectedUser,
    formValue,
    infoClick,
  } = datas;

  const {
    handleChevronClick,
    handleConfirmDelete,
    handleDropdown,
    handleDropdownMenuClick,
    handleEllipsisClick,
    handleChange,
    handleInfoClick,
    handleCloseModal,
    handleProfilePicUpdate,
    handleProfilePic,
    handleAddUser,
    handleAddUserInputChange,
    handleSaveAdded,
    handleSaveUpdate,
    handleAddCardClick
  } = handlers;

  const [activeTabId, setActiveTabId] = useState('all');
  
  // Classification logic
  const filteredData = () => {
    switch (activeTabId) {
      case 'chairs':
        return [{ data: taskForceChair, label: 'Chair' }];
      case 'members':
        return [{ data: taskForceMember, label: 'Member' }];
      case 'all':
      default:
        return [
          { data: taskForceChair, label: "Chair" },
          { data: taskForceMember, label: "Member" }
        ];
    }
  };
  
  return (
    <DeanLayout>
      <div className='flex-1 h-full bg-slate-800'>
        <div className='sticky top-0 flex items-center justify-between p-4 bg-slate-900 border-l border-b border-slate-700 z-50 mb-8'>
          <h2 className='text-3xl text-slate-100 font-bold'>
            Task Force
          </h2>
          <button className='text-slate-100 p-2 hover:bg-slate-700 rounded-full cursor-pointer active:scale-95'>
            <Search className='h-8 w-8'/>
          </button>
        </div>
        <div className='relative px-4 flex justify-between ml-4'>
          <div className='flex gap-x-1'>
            {cardNav.map((item) => (
              <p 
                onClick={() => setActiveTabId(item.id)}
                key={item.id}
                className={`min-w-20 text-center px-5 text-lg text-slate-100 cursor-pointer ${activeTabId === item.id ? 'border-slate-700 border-t border-x bg-slate-900 font-semibold -mb-0.5 z-20 rounded-t-xl' : 'border-transparent hover:bg-slate-700 rounded-xl mb-1'}`}
              >
                {item.label}
              </p>
            ))}
          </div>
          <div className='absolute bottom-2 right-2'>
            <button 
              title={taskForceChair.length > 0 || taskForceMember.length > 0 ? 'Add Task Force' : 'Create Task Force'} 
              onClick={handleAddUser} 
              className='rounded-full mr-2 cursor-pointer transition-all shadow p-2 hover:bg-slate-700'>
              <UserRoundPlus className='text-slate-100 h-8 w-8'/>
            </button>
          </div>
        </div>
        
        {loading ? (
          <VerifiedUserSkeletonLoader />
        ) : (
          <>
            {activeTabId === 'all' ? (
              (taskForceChair.length > 0 || taskForceMember.length > 0) && (
                <div className='relative p-4 pt-10 space-y-10 border bg-slate-900 shadow-md border-slate-600 rounded-lg mx-4'>
                  {/* Chairs Section */}
                  {taskForceChair.length > 0 && (
                    <div>
                      <div className='flex items-center justify-center mb-6'>
                        <h2 className='flex items-center justify-center w-1/2 p-2 text-2xl bg-gradient-to-l from-slate-900 via-green-600 to-slate-900 shadow-md text-slate-50 rounded font-bold'>
                          {taskForceChair.length > 1 ? 'CHAIRS' : 'CHAIR'}
                        </h2>
                      </div>
                      <TaskForceCard
                        dropdownRef={dropdownRef}
                        activeDropdownId={activeDropdownId}
                        setActiveDropdownId={setActiveDropdownId}
                        label='Chair'
                        taskForce={taskForceChair}
                        navigation={(user) =>
                          navigate(TASK_FORCE_DETAIL(user.user_uuid), {
                            state: { fromSection: 'Chair' },
                          })
                        }
                        profilePic={(user) => getProfilePicPath(user.profile_pic_path)}
                        handleDropdown={handleDropdown}
                        handleEllipsisClick={handleEllipsisClick}
                        handleAddCardClick={handleAddCardClick}
                      />
                    </div>
                  )}

                  {/* Members Section */}
                  {taskForceMember.length > 0 && (
                    <div>
                      <div className='flex items-center justify-center mb-6'>
                        <h2 className='flex items-center justify-center w-1/2 p-2 text-2xl bg-gradient-to-l from-slate-900 via-green-600 to-slate-900 shadow-md text-slate-50 rounded font-bold'>
                          {taskForceMember.length > 1 ? 'MEMBERS' : 'MEMBER'}
                        </h2>
                      </div>
                      <TaskForceCard
                        dropdownRef={dropdownRef}
                        activeDropdownId={activeDropdownId}
                        setActiveDropdownId={setActiveDropdownId}
                        label='Member'
                        taskForce={taskForceMember}
                        navigation={(user) =>
                          navigate(TASK_FORCE_DETAIL(user.user_uuid), {
                            state: { fromSection: 'Member' },
                          })
                        }
                        profilePic={(user) => getProfilePicPath(user.profile_pic_path)}
                        handleDropdown={handleDropdown}
                        handleEllipsisClick={handleEllipsisClick}
                        handleAddCardClick={handleAddCardClick}
                      />
                    </div>
                  )}
                </div>
              )
            ) : (
              filteredData().map(({ data, label }) =>
                data.length > 0 ? (
                  <div
                    key={label}
                    className="relative p-4 pt-10 space-y-6 border bg-slate-900 shadow-md border-slate-600 rounded-lg mx-4"
                  >
                    <div className="flex items-center justify-center">
                      <h2 className="flex items-center justify-center w-1/2 p-2 text-2xl bg-gradient-to-l from-slate-900 via-green-600 to-slate-900 shadow-md text-slate-50 rounded font-bold">
                        {data.length > 1 ? `${label.toUpperCase()}S` : label.toUpperCase()}
                      </h2>
                    </div>
                    <TaskForceCard
                      dropdownRef={dropdownRef}
                      activeDropdownId={activeDropdownId}
                      setActiveDropdownId={setActiveDropdownId}
                      label={label}
                      taskForce={data}
                      navigation={(user) =>
                        navigate(TASK_FORCE_DETAIL(user.user_uuid), {
                          state: { fromSection: label },
                        })
                      }
                      profilePic={(user) => getProfilePicPath(user.profile_pic_path)}
                      handleDropdown={handleDropdown}
                      handleEllipsisClick={handleEllipsisClick}
                      handleAddCardClick={handleAddCardClick}
                    />
                  </div>
                ) : (
                  <div
                    key={label}
                    className="relative p-4 pb-10 space-y-6 border bg-slate-900 shadow-md border-slate-600 rounded-lg mx-4"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <img className='h-80 w-80' src={searchUser} alt="" />
                      <p className='text-2xl text-slate-100 font-medium mr-12'>
                        No data to display.
                      </p>
                    </div>
                  </div>
                )
              )
            )}

            {/* If nothing to show */}
            {!loading &&
              taskForceChair.length === 0 &&
              taskForceMember.length === 0 && (
                <div className="flex flex-col items-center justify-center h-100">
                  <UserRoundX className="text-slate-700 w-40 md:w-60 h-auto" />
                  <p className="text-lg md:text-xl font-medium text-slate-700">
                    No data to display at the moment.
                  </p>
                </div>
              )}
          </>
        )}
      </div>
      <TaskForceModal
        data={{
          taskForceChair,
          taskForceMember,
          loading,
          modalType,
          modalData,
          formValue,
          emailAlreadyExist,
          updatedValue,
          selectedUser,
          infoClick,
          isUpdateBtnDisabled,
        }}

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