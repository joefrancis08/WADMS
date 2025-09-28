import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { ArrowLeft, CalendarDays, ChevronDown, EllipsisVertical, LoaderCircle, Mail, Pen, Trash2 } from 'lucide-react';
import TimeAgo from '../../components/TimeAgo';
import VerifiedUserDetailSkeletonLoader from '../../components/Loaders/VerifiedUserDetailSkeletonLoader';
import useTaskForceDetail from '../../hooks/Dean/useTaskForceDetail';
import { useTaskForce } from '../../hooks/Dean/useTaskForce';
import ProfilePicture from '../../components/ProfilePicture';
import getProfilePicPath from '../../utils/getProfilePicPath';
import TaskForceModal from '../../components/Dean/TaskForce/TaskForceModal';
import { notAssigned, notAssignedDM, toga } from '../../assets/icons';

const AssignmentCard = ({ children }) => {
  return (
    <div className='bg-slate-900 min-w-85 min-h-65 rounded-xl p-2 pb-4 border border-slate-700'>
      {children}
    </div>
  );
};

const TaskForceDetail = () => {
  
  const { states: TFStates, datas: TFDatas, handlers: TFHandlers } = useTaskForce();
  const { 
    toggleDropdown,
    setUpdatedProfilePic
  } = TFStates;
  const { 
    updatedValue,
    modalType,
    isUpdateBtnDisabled
  } = TFDatas;
  const {
    handleChevronClick,
    handleConfirmDelete,
    handleDropdownMenuClick,
    handleChange,
    handleCloseModal,
    handleProfilePicUpdate,
    handleDelete,
    handleUpdate,
    handleSaveUpdate
  } = TFHandlers;

  const { states, datas, handlers, constant } = useTaskForceDetail();
  const { TASK_FORCE } = constant;
  const { loading, loadingAssignments, errorAssignments } = states;
  const { selectedUser, assignmentData } = datas;
  const { refetchAssignments } = handlers;

  const profilePicPath = getProfilePicPath(selectedUser?.profilePicPath);
  
  return (
    <AdminLayout>
      <main className="px-4 py-6 w-full max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Link to={TASK_FORCE} className='flex items-center gap-4 text-slate-900 dark:text-slate-100'>
            <button className='p-2 hover:bg-slate-700 rounded-full active:scale-98 cursor-pointer'>
              <ArrowLeft />
            </button>
            
          </Link>
          <p className='text-lg md:text-2xl text-slate-900 dark:text-slate-100'>
            {selectedUser?.fullName ?? 'User'}'s Info
          </p>
        </div>
        {loading 
          ? (
              <div className='flex items-center justify-center'>
                <VerifiedUserDetailSkeletonLoader />
              </div>
            )
          : (
            <div className='flex flex-col w-full h-full bg-slate-900 px-8 rounded-xl border border-slate-700 shadow'>
              <div className='flex justify-between items-center gap-2 md:p-1 mt-2'>
                <p className='text-3xl font-semibold dark:text-slate-100 p-2'>
                  Profile
                </p>
                <div>
                  <button
                    title='Update Info'
                    onClick={(e) => handleUpdate(e, selectedUser)}
                    className='text-white rounded-full p-3 cursor-pointer transition-all duration-300 hover:bg-slate-800 active:opacity-20 active:scale-95'
                  >
                    <Pen size={20}/>
                  </button>
                  <button
                    title='Delete'
                    onClick={(e) => handleDelete(e, selectedUser)}
                    className='text-red-400 rounded-full p-3 cursor-pointer transition-all duration-300  hover:bg-slate-800 active:opacity-20 active:scale-95'
                  >
                    <Trash2 size={20}/>
                  </button>
                </div>
              </div>
              <hr className='text-slate-700 w-full mb-8 mx-auto'></hr>
              <div className='bg-gradient-to-b from-green-700 to-amber-300 rounded-xl shadow-md shadow-slate-800 mb-8'>
                <div className='flex max-lg:flex-col items-center px-5 pb-5 pt-8 lg:flex-row md:px-15 md:pb-5 justify-evenly'>
                  <div className='rounded-full shadow-md'>
                    <ProfilePicture
                      name={selectedUser?.fullName} 
                      profilePic={profilePicPath}
                      textSize={'text-5xl'}
                      height={'h-40 md:h-65 lg:h-70'} 
                      width={'w-40 md:w-65 lg:w-70'} 
                      border={'rounded-full border-4 border-green-800'}/>
                  </div>
                  <div className='flex flex-col items-center gap-y-5'>
                    <div className='flex items-center w-auto text-wrap text-center h-auto pt-8'>
                      <p className='max-sm:text-xl max-lg:text-3xl lg:text-5xl text-white font-bold'>
                        {selectedUser?.fullName}
                      </p>
                    </div>
                    <div className='flex justify-center w-auto h-auto pb-4'>
                      <p className='max-sm:text-lg max-lg:text-xl lg:text-2xl font-bold text-green-700 bg-slate-100 px-4 py-2 rounded'>
                        {selectedUser?.role}
                      </p>
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
        <div className='flex flex-col w-full h-full bg-slate-900 px-8 mt-4 rounded-xl border border-slate-700 shadow'>
          <div className='flex justify-between items-center md:p-1 my-2'>
            <p className='text-3xl font-semibold dark:text-slate-100 p-2'>
              Assignments
            </p>
            <div>
              <button
                title='Update Info'
                onClick={() => console.log('Clicked!')}
                className='flex items-center -mr-4 text-white rounded-full p-3 cursor-pointer transition-all duration-300 hover:bg-slate-800 active:opacity-20 active:scale-95'
              >
                <EllipsisVertical />
              </button>
            </div>
          </div>
          <div className='bg-slate-900 border-t border-slate-700 mt-2 mb-8 min-h-100 p-2'>
            {loadingAssignments ? (
              <div className='flex gap-y-4 flex-col items-center justify-center h-100 w-full'>
                <LoaderCircle className='h-24 w-24 animate-spin text-slate-100'/>
                <p className='text-slate-300'>Loading assignment data...</p>
              </div>
            ) : (
              assignmentData.length > 0 ? assignmentData.map((data) => (
                <div className='flex flex-col items-center px-5 pb-5 pt-8 gap-y-6 md:px-15 md:pb-5 justify-evenly'>
                  <div className='flex flex-col gap-y-1 items-center justify-center'>
                    <h2 className='text-3xl dark:text-slate-100 font-bold tracking-wide'>
                      {data?.accredTitle} {data?.accredYear}
                    </h2>
                    <h4 className='text-xl dark:text-green-800 font-extrabold dark:bg-slate-100 px-4 py-1 rounded-md'>
                      {data?.level}
                    </h4>
                  </div>
                  <div className='flex flex-wrap justify-center gap-10'>
                    <AssignmentCard>
                      <div className='flex flex-col items-center justify-center'>
                        <h4 className='text-slate-100 text-xl p-2 font-bold'>
                          Assigned Program
                        </h4>
                        <div className='bg-gradient-to-b from-green-700 to-amber-300 min-w-80 min-h-40 m-4 rounded-lg'>
                          <div className='relative flex items-center justify-center'>
                            <img src={toga} alt="Toga Icon" loading='lazy' className='opacity-10 h-60 w-60'/>
                            <p className='absolute top-1/2 left-1/2 -translate-1/2 text-center text-3xl text-white font-bold'>
                              {data?.program}
                            </p>
                          </div>
                        </div>
                        <div className='pb-2 flex justify-between items-center'>
                          <button className='bg-slate-800 text-slate-100 px-4 py-2 rounded-md text-md cursor-pointer hover:bg-slate-700 transition active:scale-95 max-w-75'>
                            View Areas & Parameters
                          </button>
                        </div>
                      </div>
                    </AssignmentCard>
                  </div>
                </div>
              )) : (
                <div className='flex gap-y-4 flex-col items-center justify-center h-100 w-full'>
                  <img src={notAssignedDM} alt="Denied Icon" className='h-60 w-60 opacity-50' loading='lazy'/>
                  <p className='text-lg text-slate-300'>
                    Not assigned. {' '}
                    <span className='text-slate-100 font-semibold hover:underline cursor-pointer active:opacity-80'>
                      Assign
                    </span>
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
      <TaskForceModal 
        data={{
          modalType,
          updatedValue,
          selectedUser,
          isUpdateBtnDisabled
        }}
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
