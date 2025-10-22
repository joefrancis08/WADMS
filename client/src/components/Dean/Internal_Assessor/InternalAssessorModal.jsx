import React from 'react';
import MODAL_TYPE from '../../../constants/modalTypes';
import AddUserModal from '../../Modals/user/AddUserModal';
import ImageUpload from '../../Form/Upload/ImageUpload';
import AddField from '../../Form/AddField';
import { deleteUser } from '../../../assets/icons';
import ConfirmationModal from '../../Modals/ConfirmationModal';

const InternalAssessorModal = ({ refs, data, states, handlers }) => {
  const { modalType, modalData, formValue } = data;
  const { setProfilePic } = states;
  const { 
    handleCloseModal = () => {}, 
    handleProfilePic = () => {},
    handleFieldChange = () => {},
    handleAddAssessor = () => {},
    handleConfirmDelete = () => {}, 
  } = handlers;

  switch (modalType) {
    case MODAL_TYPE.ADD_ASSESSOR:
      return (
        <AddUserModal
          onClose={() => handleCloseModal({ addAssessor: true })}
          onCancel={() => handleCloseModal({ addAssessor: true })}
          onSaveAdded={(e) => handleAddAssessor(e)}
          primaryButton='Add'
          secondaryButton='Cancel'
          disabled={
            formValue.fullName.trim() === '' ||
            formValue.email.trim() === ''
            // loading ||
            // emailAlreadyExist ||
            // !emailRegex.test(formValue.email)
          }
          disabledMessage='Full name and email are required.'
          headerContent={
            <div>
              <p className='text-lg font-semibold text-slate-800'>Add Internal Assessor</p>
            </div>
          }
          bodyContent={
            <>
              <ImageUpload 
                onChange={handleProfilePic}
                setProfilePic={setProfilePic}
                setUpdatedProfilePic={null}
                imageValue={null}
                allowRemove={true}
              />
              <AddField
                autoFocus={true}
                fieldName='Full Name' 
                type='text' 
                name='fullName' 
                formValue={formValue.fullName} 
                onChange={handleFieldChange} 
              />
              <AddField 
                fieldName='Email Address' 
                type='text' 
                name='email' 
                formValue={formValue.email} 
                onChange={handleFieldChange} 
                // invalid={emailAlreadyExist}
              />
            </>
          }
        />
      );

    case MODAL_TYPE.DELETE_ASSESSOR:
      return (
        <ConfirmationModal
          onClose={() => handleCloseModal({ deleteAssessor: true })}
          onCancelClick={() => handleCloseModal({ deleteAssessor: true })}
          onConfirmClick={() => handleConfirmDelete(modalData.uuid, modalData.fullName)}
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

    default:
      return null;
  }
};

export default InternalAssessorModal;
