import ModalLayout from '../Layout/ModalLayout';
import { ShieldCheck, Trash2, X } from 'lucide-react';
import TimeAgo from '../TimeAgo';
import ProfilePicture from '../ProfilePicture';

const UserProfileHeader = ({ selectedUser, onClose }) => {
  return (
    <>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        aria-label="Close"
      >
        <X />
      </button>

      {/* Header */}
      <div className='w-full flex flex-col md:flex-row rounded items-center justify-center py-5 border border-gray-200 shadow-md'>
        <div>
          <ProfilePicture name={selectedUser?.full_name} height={'md:h-36 h-32'} width={'md:w-36 w-32'} border={'rounded-full'}/>
        </div>
        <div className='relative p-4 flex'>
          <p className=" border border-gray-200 rounded-md p-4 text-xl md:text-2xl font-bold text-green-900 mt-2 shadow-sm bg-gray-100">
            {selectedUser?.full_name}
          </p>
        </div>
      </div>
    </>    
  )
}

const UserProfileDetails = ({ selectedUser }) => {
  return (
    <>
      <div className='relative p-4 flex'>
        <span className='text-white text-xs absolute top-3 md:left-1/2 left-1/2 -translate-x-11 md:-translate-x-11 mb-2 bg-green-700 py-1 px-2 rounded-md'>Email Address</span>
        <p className=" border border-gray-300 rounded-lg p-4 text-md font-bold text-green-900 mt-2 shadow-inner bg-gray-100">
          {selectedUser?.email}
        </p>
      </div>
      <div className='relative p-4 flex'>
        <span className='text-white text-xs text-center absolute top-3 md:left-1/2 left-1/2 -translate-x-22 md:-translate-x-22 mb-2 bg-green-700 py-1 px-4 w-45 rounded-md'>Registration Date & Time</span>
        <p className="flex border border-gray-300 rounded-lg p-4 text-md font-semibold text-green-900 mt-2 shadow-inner bg-gray-100">
          <TimeAgo date={selectedUser?.created_at}/>
        </p>
      </div>
    </> 
  )
}

const UserProfileAction = ({ onVerifyClick, onDeleteClick }) => {
  return (
    <>
      <button
        onClick={onDeleteClick}
        className='flex items-center justify-center bg-gradient-to-br from-red-800 to-red-500 text-white px-6 md:px-10 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-red-800 hover:to-red-500 hover:shadow-lg active:opacity-50 transition cursor-pointer'>
        <Trash2 className='mr-1'/>
        Delete
      </button>
      <button 
        onClick={onVerifyClick}
        className='flex items-center justify-center bg-gradient-to-br from-green-800 to-green-500 text-white px-6 md:px-10 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50 transition cursor-pointer'>
        <ShieldCheck className='mr-1'/>
        Verify
      </button>
    </>
  )
}

const UserProfileModal = ({ selectedUser, onClose, onVerifyClick, onDeleteClick }) => {
  return (
    <ModalLayout 
      onClose={onClose}
      header={<UserProfileHeader selectedUser={selectedUser} onClose={onClose} />}
      body={<UserProfileDetails selectedUser={selectedUser} />}
      footer={<UserProfileAction onVerifyClick={onVerifyClick} onDeleteClick={onDeleteClick} />}
      border={'border border-gray-300 rounded-md shadow'}
      footerPosition={'justify-evenly'}
    />
  );
};

export default UserProfileModal;
