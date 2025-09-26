import MODAL_TYPE from '../../../constants/modalTypes';
import { CircleQuestionMark, Trash2 } from 'lucide-react';
import ImageUpload from '../../Form/Upload/ImageUpload';
import AddUserModal from '../../Modals/user/AddUserModal';
import UpdateUserModal from '../../Modals/user/UpdateUserModal';
import UpdateField from '../../Form/UpdateField';
import ConfirmationModal from '../../Modals/ConfirmationModal';
import AddField from '../../Form/AddField';
import { emailRegex } from '../../../utils/regEx';
import Tooltip from '../../Popover';
import Popover from '../../Popover';

const TaskForceModal = ({ data, handlers }) => {
  const {
    loading,
    modalType,
    modalData,
    formValue,
    emailAlreadyExist,
    updatedValue,
    selectedUser,
    infoClick,
    isUpdateBtnDisabled,
    taskForceChair,
    taskForceMember
  } = data;

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
    case MODAL_TYPE.ADD_TF:
      return (
        <AddUserModal
          onClose={() => handleCloseModal({ isForAddUser: true, untoggleDropdown: true, clearForm: true })}
          onCancel={() => handleCloseModal({ isForAddUser: true, untoggleDropdown: true, clearForm: true })}
          onSaveAdded={(e) => handleSaveAdded(e, { from: 'main'})}
          disabled={
            formValue.fullName.trim() === '' ||
            formValue.email.trim() === '' ||
            formValue.role.trim() === '' ||
            loading ||
            emailAlreadyExist ||
            !emailRegex.test(formValue.email)
          }
          primaryButton="Create"
          secondaryButton="Cancel"
          headerContent={
            <div className='relative flex items-center transition-all duration-300'>
              <p className='mr-2 text-2xl font-bold text-slate-700'>
                {taskForceChair.length > 0 || taskForceMember.length > 0 
                  ? 'Add Task Force'
                  : 'Create Task Force'
                }
              </p>
              <CircleQuestionMark 
                onClick={handleInfoClick}
                className='text-slate-500 hover:text-slate-600 cursor-pointer' size={20}
              />
              {infoClick && (
                <Popover 
                  handleInfoClick={handleInfoClick}
                  position='top-2 left-1/2 translate-x-1/2'
                  content={
                    <p className='text-slate-100 text-xs p-2'>
                      The "Create" button is enabled only if all mandatory fields (excluding the profile picture) are completed and the email is correctly formatted and not already taken.
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

    case MODAL_TYPE.ADD_TF_CARD:
      return (
        <AddUserModal
          onClose={() => handleCloseModal({ clearForm: true })}
          onCancel={() => handleCloseModal({ clearForm: true })}
          onSaveAdded={(e) => handleSaveAdded(e, { from: 'card', data: { role: modalData.role }})}
          disabled={
            formValue.fullName.trim() === '' ||
            formValue.email.trim() === '' ||
            loading ||
            emailAlreadyExist ||
            !emailRegex.test(formValue.email)
          }
          primaryButton={`Add ${modalData.role}`}
          secondaryButton="Cancel"
          headerContent={
            <div className='relative flex items-center transition-all duration-300'>
              <p className='mr-2 text-2xl font-bold text-slate-700'>
                Add {modalData.role}
              </p>
              <CircleQuestionMark 
                onClick={handleInfoClick}
                className='text-slate-500 hover:text-slate-600 cursor-pointer' size={20}
              />
              {infoClick && (
                <Popover 
                  handleInfoClick={handleInfoClick}
                  position='top-2 left-1/2 translate-x-1/2'
                  content={
                    <p className='text-slate-100 text-xs p-2'>
                      The "Create" button is enabled only if all mandatory fields (excluding the profile picture) are completed and the email is correctly formatted and not already taken.
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
              <hr className='text-gray-300 mt-2'></hr>
            </>
          }
        />
      );

    case MODAL_TYPE.UPDATE_TF:
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

    case MODAL_TYPE.TF_DELETION_CONFIRMATION:
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
                  <div className='p-6 bg-red-400/20 rounded-full'>
                    <Trash2 className='text-red-500/80 h-12 w-12'/>
                  </div>
                </div>
                <div className='pb-4 pt-1 flex flex-col items-center justify-center gap-y-2'>
                  <p className='text-center text-2xl text-red-500 font-semibold'>
                    Delete
                  </p>
                  <p className='text-lg font-medium text-slate-900'>
                    {selectedUser?.full_name}
                  </p>
                </div>
                <div>
                  <p className='pb-6 text-lg text-slate-800 text-center'>
                    Are you sure you want to delete this user?
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
