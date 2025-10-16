import MODAL_TYPE from '../../../constants/modalTypes';
import { Check, CheckCheck, CheckCircle, CircleQuestionMark, Copy, Link, Link2, LoaderCircle, Mail, Send, Trash2, X } from 'lucide-react';
import ImageUpload from '../../Form/Upload/ImageUpload';
import AddUserModal from '../../Modals/user/AddUserModal';
import UpdateUserModal from '../../Modals/user/UpdateUserModal';
import UpdateField from '../../Form/UpdateField';
import ConfirmationModal from '../../Modals/ConfirmationModal';
import AddField from '../../Form/AddField';
import { emailRegex } from '../../../utils/regEx';
import Tooltip from '../../Popover';
import Popover from '../../Popover';
import { deleteUser, gmailIcon } from '../../../assets/icons';
import { useState } from 'react';
import { showSuccessToast } from '../../../utils/toastNotification';
import { generateNewToken, shareToken } from '../../../api-calls/Users/userAPI';

const CLIENT_BASE_URL = import.meta.env.VITE_CLIENT_BASE_URL;

const TaskForceModal = ({ data, handlers }) => {
  const now = new Date();
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
    taskForceMember,
    accessTokens,
    loadingAccessTokens, 
    errorAccessTokens, 
    refetchAccessTokens
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

  console.log(modalData);
  
  const accessToken = accessTokens?.find(t => modalData?.userId === t?.userId)?.accessToken;
  const expireAt = new Date(accessTokens?.find(t => modalData?.userId === t?.userId)?.accessTokenExpiration);
  const isExpired = expireAt < now;
  const isUsed = accessTokens?.find(t => modalData?.userId === t?.userId)?.isUsed;
  const url = accessToken ? `${CLIENT_BASE_URL}/share/${accessToken}` : '';

  console.log(accessToken);
  console.log(isExpired);
  console.log(isUsed);
  console.log(loadingAccessTokens);

  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
      showSuccessToast('Copied to clipboard!');

    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleGenerateNewToken = async (userUUID) => {
    try {
      const res = await generateNewToken(userUUID);
      console.log(res);
      refetchAccessTokens();

    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  };

  const handleShareLink =  async () => {
    try {
      setSending(true);
      const res = await shareToken({
        email: modalData.email,
        fullName: modalData.fullName,
        accessLink: url
      });

      console.log(res);
      if(res.data.success) {
        showSuccessToast(res.data.message);
      }

      setSending(false);
      
    } catch (error) {
      console.error('Error sending access link:', error);
      throw error;

    }
  };

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
          disabledMessage={'Fields should not be empty, except profile picture.'}
          primaryButton="Create"
          secondaryButton="Cancel"
          headerContent={
            <div className='relative flex items-center transition-all duration-300'>
              <p className='mr-2 text-lg font-semibold text-slate-700'>
                {taskForceChair.length > 0 || taskForceMember.length > 0 
                  ? 'Add Task Force'
                  : 'Create Task Force'
                }
              </p>
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
          disabledMessage='Fields should not be empty, except profile picture.'
          primaryButton={`Add ${modalData.role}`}
          secondaryButton="Cancel"
          headerContent={
            <div className='relative flex items-center transition-all duration-300'>
              <p className='mr-2 text-2xl font-bold text-slate-700'>
                Add {modalData.role}
              </p>
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
          headerContent={`Update ${selectedUser.fullName}'s Info`}
          primaryButton="Save Update"
          disabled={isUpdateBtnDisabled}
          secondaryButton="Cancel"
          bodyContent={
            <>
              <ImageUpload
                onChange={handleProfilePicUpdate}
                setUpdatedProfilePic={setUpdatedProfilePic} 
                imageValue={selectedUser?.profilePicPath} 
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
          onConfirmClick={() => handleConfirmDelete(selectedUser?.uuid)}
          isDelete
          primaryButton="Delete"
          secondaryButton="Cancel"
          hasHeader={true}
          headerContent={
            <p className='text-lg font-semibold text-red-600'>Confirm Delete</p>
          }
          bodyContent={
            <>
              <div className='flex flex-col justify-center'>
                <div className='flex justify-center px-4'>
                  <img src={deleteUser} alt="Delete User Icon" className='h-16 w-16' />
                </div>
                <div>
                  {console.log(modalData)}
                  <p className='my-6 text-slate-800 text-center'>
                    Do you want to delete <span className='font-medium'>{modalData.fullName}</span>?
                  </p>
                </div>
              </div>
            </>
          }
        />
      );

    case MODAL_TYPE.VIEW_ACCESS_LINK:
      return (
        <div className="h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs overflow-hidden">
          <div className="w-full md:max-w-xl max-md:mx-4 bg-white rounded shadow-2xl px-6 pt-4 animate-fadeIn ">
            <div className='flex text-slate-900 text-lg font-medium justify-between items-center max-md:items-center'>
              Access Link of {modalData.fullName}
              <button 
                onClick={() => handleCloseModal({ viewAccessLink: true })}
                className='p-1 hover:bg-slate-200 rounded-full -mr-2 cursor-pointer active:scale-95'>
                <X className='h-5 w-5'/>
              </button>
            </div>
            {loadingAccessTokens ? (
                <div className='w-full flex flex-col my-4 justify-center gap-y-3'>
                  <LoaderCircle className='h-16 w-16 animate-spin'/>
                </div>
              ) : (
                <div className='w-full flex flex-col my-4 justify-center gap-y-3'>
                  <p className='text-xs -mb-2'>
                    Please share this link only with <span className='font-semibold'>{modalData.fullName}</span> to ensure that access remain secure and limited to the intended recipient. This is only valid for <span className='font-semibold'>3 days</span> and can only be used once.
                  </p>
                  <div className='relative flex justify-between w-full items-start'>
                      <input 
                        type='text'
                        value={url}
                        readOnly
                        className='relative border border-slate-300 rounded-md pl-10 pr-15 py-4 w-full text-center focus:outline-0 cursor-default'
                      />
                      <Link className='absolute top-4.5 left-3 h-5 w-5 text-slate-700'/>
                      <button 
                        onClick={handleCopy}
                        className='absolute top-3 right-3 p-2 hover:bg-slate-200 rounded-full cursor-pointer active:scale-95'>
                        {copied ? <Check className='text-green-700 h-4 w-4 font-bold' /> : <Copy className='h-4 w-4'/>}
                      </button>
                  </div>
                  <div className='-mt-3'>
                    {isExpired && (
                      <p className='text-sm text-red-500'>
                        {isExpired === 0 && 'Link expired. Generate new.'}
                      </p>
                    )}
                    {isUsed === 1 && (
                      <p className='text-sm text-red-500'>
                        {isUsed === 1 && 'Link already used. Generate new.'}
                      </p>
                    )}
                  </div>
                  <div className='flex justify-between items-center'>
                    <button
                      onClick={() => handleGenerateNewToken(modalData.userUUID)} 
                      className='flex items-center justify-center gap-x-2 text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-slate-200 border border-slate-300 active:scale-95 transition'>
                      {loadingAccessTokens ? <LoaderCircle className='h-5 w-5 text-slate-700 animate-spin'/> : <Link2 className='h-5 w-5'/>}
                      {loadingAccessTokens ? 'Generating...' : 'Generate new'}
                    </button>
                    <button 
                      onClick={handleShareLink}
                      className={`flex items-center justify-center text-sm pl-1 pr-3 py-1 rounded-full cursor-pointer hover:bg-slate-200 border border-slate-300 active:scale-95 transition`}>
                      {sending ? <LoaderCircle className='h-5 w-5 animate-spin text-slate-500 mr-2' /> : <img src={gmailIcon} alt='Gmail Logo'className='h-5 w-auto' loading='lazy' /> }
                      {sending ? 'Sending...' : 'Send via email'}
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default TaskForceModal;
