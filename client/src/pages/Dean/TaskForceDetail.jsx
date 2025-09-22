import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { ArrowLeft, CalendarDays, ChevronLeft, Mail, Pen, Trash2 } from 'lucide-react';
import TimeAgo from '../../components/TimeAgo';
import VerifiedUserDetailSkeletonLoader from '../../components/Loaders/VerifiedUserDetailSkeletonLoader';
import useTaskForceDetail from '../../hooks/Dean/useTaskForceDetail';
import { useTaskForce } from '../../hooks/Dean/useTaskForce';
import ProfilePicture from '../../components/ProfilePicture';
import getProfilePicPath from '../../utils/getProfilePicPath';
import TaskForceModal from '../../components/Dean/TaskForce/TaskForceModal';

const TaskForceDetail = () => {
  
  const { chevron, confirmDelete, dropdown, form, modal, profilePic, 
    saveButton, userDelete, userUpdate } = useTaskForce();
  const { handleChevronClick } = chevron;
  const { handleConfirmDelete } = confirmDelete;
  const { handleDropdownMenuClick, toggleDropdown } = dropdown;
  const { updatedValue, handleChange } = form;
  const { modalType, handleCloseModal } = modal;
  const { setUpdatedProfilePic, handleProfilePicUpdate } = profilePic;
  const { isUpdateBtnDisabled } = saveButton;
  const { handleDelete } = userDelete;
  const { handleUpdate, handleSaveUpdate } = userUpdate;

  const { constant, data, state } = useTaskForceDetail();
  const { TASK_FORCE } = constant;
  const { selectedUser } = data;
  const { loading } = state;

  const profile_pic_path = getProfilePicPath(selectedUser?.profile_pic_path);
  
  return (
    <AdminLayout>
      <main className="px-4 py-6 md:px-8 w-full max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Link to={TASK_FORCE} className="flex items-center gap-4 text-slate-700">
            <ArrowLeft className='hover:opacity-75 active:opacity-50' size={32}/>
            <p className='text-lg md:text-2xl'>
              {selectedUser?.full_name ?? 'User'}'s Info
            </p>
          </Link>
        </div>
        {loading 
          ? (
              <div className='flex items-center justify-center'>
                <VerifiedUserDetailSkeletonLoader />
              </div>
            )
          : (
            <div className='flex flex-col w-full h-full bg-slate-800 px-8 rounded-xl border border-gray-100 shadow'>
              <div className='flex justify-end px-2 md:p-1'>
                <button
                  title='Update Info'
                  onClick={(e) => handleUpdate(e, selectedUser)}
                  className='text-white rounded-full p-4 cursor-pointer transition-all duration-300 hover:bg-slate-600 active:opacity-20'
                >
                  <Pen />
                </button>
                <button
                  title='Delete'
                  onClick={(e) => handleDelete(e, selectedUser)}
                  className='text-red-400 rounded-full p-4 cursor-pointer transition-all duration-300  hover:bg-slate-600 active:opacity-20'
                >
                  <Trash2 />
                </button>
              </div>
              <div className='bg-gradient-to-b from-green-700 to-amber-300 rounded-xl shadow-md mb-8'>
                <div className='flex max-lg:flex-col items-center px-5 pb-5 pt-8 lg:flex-row md:px-20 md:pb-5 justify-evenly'>
                  <div className='rounded-full shadow-md'>
                    <ProfilePicture
                      name={selectedUser?.full_name} 
                      profilePic={profile_pic_path}
                      textSize={'text-5xl'}
                      height={'h-40 md:h-65 lg:h-70'} 
                      width={'w-40 md:w-65 lg:w-70'} 
                      border={'rounded-full border-4 border-green-800'}/>
                  </div>
                  <div className='flex flex-col items-center gap-y-5'>
                    <div className='flex items-center w-auto text-wrap text-center h-auto pt-8'>
                      <p className='max-sm:text-4xl max-lg:text-5xl lg:text-7xl text-white font-bold'>{selectedUser?.full_name}</p>
                    </div>
                    <div className='flex justify-center w-auto h-auto pb-4'>
                      <p className='max-sm:text-xl max-lg:text-2xl lg:text-3xl font-bold text-slate-100'>{selectedUser?.role}</p>
                    </div>
                  </div>
                </div>
                <hr className='max-lg:block hidden max-lg:w-1/3 max-md:w-5/10 mx-auto text-gray-400'></hr>
                <div className='px-5'>
                  <div className='flex flex-col py-5 justify-center lg:flex-row items-center  max-lg:gap-6 lg:justify-between'>
                    <div className='flex max-md:flex-col items-center gap-1 text-gray-500'>
                      <Mail color='green' size={32}/>
                      <p className='text-md text-center md:text-xl text-slate-800 font-medium'>
                        {selectedUser?.email}
                      </p>
                    </div>
                    <div className='flex max-md:flex-col items-center gap-1'>
                      <CalendarDays color='green' size={32}/>
                      <p className='text-md md:text-xl text-center text-gray-800 font-medium '>
                        {selectedUser?.created_at && (
                          <TimeAgo date={selectedUser?.created_at} action='Created'/>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </main>
      <TaskForceModal 
        modalType={modalType}
        updatedValue={updatedValue}
        selectedUser={selectedUser}
        isUpdateBtnDisabled={isUpdateBtnDisabled}
        handlers={{
          toggleDropdown,
          handleChevronClick,
          handleConfirmDelete,
          handleDropdownMenuClick,
          handleChange,
          handleCloseModal,
          setUpdatedProfilePic,
          handleProfilePicUpdate,
          handleSaveUpdate
        }}
      />
    </AdminLayout>
  );
};

export default TaskForceDetail;
