import MODAL_TYPE from '../../../constants/modalTypes';

import { CircleQuestionMark, Trash2 } from 'lucide-react';
import ImageUpload from '../Upload/ImageUpload';
import AddUserModal from '../../Modals/AddUserModal';
import UpdateUserModal from '../../Modals/UpdateUserModal';
import UpdateField from './UpdateField';
import ConfirmationModal from '../../Modals/ConfirmationModal';
import AddField from './AddField';
import { emailRegex } from '../../../utils/regEx';

const TaskForceModal = ({
  modalType,
  formValue,
  updatedValue,
  selectedUser,
  infoClick,
  handlers,
  isUpdateBtnDisabled,
}) => {
  const {
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
  } = handlers;

  switch (modalType) {
    case MODAL_TYPE.ADD_USER:
      return (
        <AddUserModal
          onClose={() => handleCloseModal({ isForAddUser: true, untoggleDropdown: true, clearForm: true })}
          onCancel={() => handleCloseModal({ isForAddUser: true, untoggleDropdown: true, clearForm: true })}
          onSaveAdded={handleSaveAdded}
          disabled={
            formValue.fullName.trim() === '' ||
            formValue.email.trim() === '' ||
            !emailRegex.test(formValue.email) ||
            formValue.role.trim() === '' 
          }
          primaryButton="Add"
          secondaryButton="Cancel"
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
          onClose={() => handleCloseModal({ untoggleDropdown: true, removeSelectedUser: true })}
          onCancelClick={() => handleCloseModal({ untoggleDropdown: true, removeSelectedUser: true })}
          onSaveClick={handleSaveUpdate}
          headerContent={`Update ${selectedUser.full_name}'s Info`}
          primaryButton="Save Update"
          disabled={isUpdateBtnDisabled}
          secondaryButton="Cancel"
          bodyContent={
            <>
              <ImageUpload
                onChange={handleProfilePicUpdate}
                setUpdatedProfilePic={setUpdatedProfilePic} 
                imageValue={selectedUser?.profile_pic_path} 
                allowRemove={false}
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
          onClose={() => handleCloseModal({ removeActiveDropdownId: true, removeSelectedUser: true })}
          onCancelClick={() => handleCloseModal({ removeActiveDropdownId: true, removeSelectedUser: true })}
          onConfirmClick={() => handleConfirmDelete(selectedUser?.user_uuid)}
          isDelete
          primaryButton="Delete"
          secondaryButton="Cancel"
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
};

export default TaskForceModal;
