import MODAL_TYPE from '../../constants/modalTypes';

import { CircleQuestionMark, Trash2 } from 'lucide-react';
import ImageUpload from '../Form/Upload/ImageUpload';
import AddUserModal from '../Modals/AddUserModal';
import UpdateUserModal from '../Modals/UpdateUserModal';
import UpdateField from '../Form/Dean/UpdateField';
import ConfirmationModal from '../Modals/ConfirmationModal';
import AddField from '../Form/Dean/AddField';
import { emailRegex } from '../../utils/regEx';
import Tooltip from '../Popover';

const TaskForceModal = ({
  modalType,
  formValue,
  emailAlreadyExist,
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
            formValue.role.trim() === '' ||
            emailAlreadyExist ||
            !emailRegex.test(formValue.email)
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
                <Tooltip 
                  handleInfoClick={handleInfoClick}
                  position='top-3 left-52'
                  content={
                    <p className='text-slate-100 text-xs p-2'>
                      The "Add" button is enabled only if all mandatory fields (excluding the profile picture) are completed and the email is correctly formatted and not already taken.
                    </p>
                  }
                />
              ) }
            </div>
          }
          bodyContent={
            <>
              <ImageUpload onChange={handleProfilePic} setProfilePic={setProfilePic}/>
              <AddField fieldName='Full Name' type='text' name='fullName' formValue={formValue.fullName} onChange={handleAddUserInputChange} />
              <AddField fieldName='Email Address' type='text' name='email' formValue={formValue.email} onChange={handleAddUserInputChange} invalid={emailAlreadyExist}/>
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
