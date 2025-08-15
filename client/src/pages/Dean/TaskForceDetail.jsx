import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { ChevronLeft, Mail, Pen, ShieldCheck, Trash2 } from 'lucide-react';
import ProfileAvatar from '../../components/ProfileAvatar';
import TimeAgo from '../../components/TimeAgo';
import VerifiedUserDetailSkeletonLoader from '../../components/Loaders/VerifiedUserDetailSkeletonLoader';
import useVerifiedUserDetail from '../../hooks/useVerifiedUserDetail';
import { useVerifiedUsers } from '../../hooks/useVerifiedUsers';
import MODAL_TYPE from '../../constants/modalTypes';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import UpdateField from '../../components/Form/Dean-and-Chairman/UpdateField';
import UpdateUserModal from '../../components/Modals/UpdateUserModal';
import { useEffect } from 'react';

const TaskForceDetail = () => {
  const { chevron, confirmDelete, dropdown, form, modal, saveButton, userDelete, userUpdate } = useVerifiedUsers();
  const { handleChevronClick } = chevron;
  const { handleConfirmDelete } = confirmDelete;
  const { handleDropdownMenuClick, toggleDropdown } = dropdown;
  const { updatedValue, handleChange } = form;
  const { modalType, handleCloseModal } = modal;
  const { isDisabled } = saveButton;
  const { handleDelete } = userDelete;
  const { handleUpdate, handleSaveUpdate } = userUpdate;

  const { constant, data, state } = useVerifiedUserDetail();
  const { TASK_FORCE } = constant;
  const { selectedUser } = data;
  const { loading } = state;
  
  const renderModal = () => {
    switch (modalType) {

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
               <UpdateField 
                  fieldName='Full Name'
                  type='text'
                  name='fullName'
                  formValue={updatedValue.fullName}
                  onChange={(e) => handleChange(e)}
                />

                <UpdateField 
                  fieldName='Email Address'
                  type='text'
                  name='email'
                  formValue={updatedValue.email}
                  onChange={(e) => handleChange(e)}
                />

                <UpdateField 
                  fieldName='Role'
                  type='text'
                  name='role'
                  formValue={updatedValue.role}
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

      case MODAL_TYPE.USER_DELETION_CONFIRMATION:
        return (
          <ConfirmationModal 
            onClose={() => handleCloseModal({removeActiveDropdownId: true, removeSelectedUser: true})}
            onCancelClick={() => handleCloseModal({removeActiveDropdownId: true, removeSelectedUser: true})}
            onConfirmClick={() => handleConfirmDelete(selectedUser?.user_uuid, {navigateBack: true})}
            isDelete={true}
            primaryButton={'Confirm'}
            secondaryButton={'Cancel'}
            headerContent={
              <p className="text-2xl font-bold text-red-600">
                Confirm Delete
              </p>
            }
            bodyContent={
              <p className='pb-4'>
                Are you sure you want to delete {selectedUser?.full_name}?
              </p>
            }
          />
        );

      default:
        break;
    }
  }

  return (
    <AdminLayout>
      <main className="px-4 py-6 md:px-8 w-full max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link to={TASK_FORCE} className="text-gray-700">
            <ChevronLeft className='hover:opacity-65 active:opacity-50' size={32}/>
          </Link>
          <p className='text-lg md:text-2xl transition'>
            {selectedUser?.full_name ?? 'User'}'s Details
          </p>
        </div>
        {loading 
          ? (
              <div className='flex items-center justify-center'>
                <VerifiedUserDetailSkeletonLoader />
              </div>
            )
          : (
            <div className='flex flex-col w-full h-full bg-gray-50 p-4 rounded-xl border border-gray-100 shadow hover:shadow-lg hover:shadow-gray-300 hover:drop-shadow-sm'>
              <div className='flex justify-end p-2 md:p-3'>
                <button
                  title='Update Info'
                  onClick={(e) => handleUpdate(e, selectedUser)}
                  className='text-gray-500 rounded-full p-4 cursor-pointer transition-all duration-300 hover:text-black hover:bg-gray-200 active:opacity-20'
                >
                  <Pen />
                </button>
                <button
                  title='Delete'
                  onClick={(e) => handleDelete(e, selectedUser)}
                  className='text-red-400 rounded-full p-4 cursor-pointer transition-all duration-300 hover:text-red-500 hover:bg-gray-200 active:opacity-20'
                >
                  <Trash2 />
                </button>
              </div>
              <div className='flex max-lg:flex-col items-center px-5 pb-5 lg:flex-row md:px-20 md:pb-20 justify-evenly'>
                <div className='rounded-full shadow-md'>
                  <ProfileAvatar 
                    name={selectedUser?.full_name} 
                    textSize={'text-5xl'}
                    height={'h-40 md:h-65 lg:h-70'} 
                    width={'w-40 md:w-65 lg:w-70'} 
                    border={'rounded-full'}/>
                </div>
                <div className='flex flex-col items-center gap-y-2'>
                  <div className='flex items-center w-auto text-wrap text-center h-auto pt-8'>
                    <p className='max-sm:text-4xl max-lg:text-5xl lg:text-7xl text-gray-900 font-bold'>{selectedUser?.full_name}</p>
                  </div>
                  <div className='flex justify-center w-auto h-auto pb-4 lg:pb-8'>
                    <p className='max-sm:text-xl max-lg:text-2xl lg:text-3xl font-bold text-gray-600'>{selectedUser?.role}</p>
                  </div>
                </div>
              </div>
              <hr className='w-[50%] m-auto text-gray-400'></hr>
              <div className='px-5 py-5'>
                <div className='flex flex-col py-5 justify-center lg:flex-row items-center  max-lg:gap-6 lg:justify-between'>
                  <div className='flex max-md:flex-col items-center text-gray-500'>
                    <Mail size={32}/>
                    <p className='ml-1 text-sm text-center md:text-xl text-gray-800 font-medium'>
                      {selectedUser?.email}
                    </p>
                  </div>
                  <div className='flex max-md:flex-col items-center'>
                    <ShieldCheck color='green' size={34}/>
                    <p className='text-sm md:text-xl text-center text-gray-800 font-medium '>
                      {selectedUser?.created_at && (
                        <TimeAgo date={selectedUser?.created_at} action='Verified'/>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <hr className='border-1 text-gray-400'></hr>
            </div>
          )
        }
      </main>
      {renderModal()}
    </AdminLayout>
  );
};

export default TaskForceDetail;
