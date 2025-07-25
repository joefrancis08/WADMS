import React from 'react';
import { X } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

const UserProfileModal = ({ onClose, header, body, footer }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full md:max-w-xl bg-gradient-to-r from-gray-100 to-white rounded-md shadow-2xl px-8 pt-8 animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={() => {
            onClose?.(), 
            navigate(`/admin/users/unverified/`)
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer"
          aria-label="Close"
        >
          <X />
        </button>

        {/* Header */}
        <div className="flex justify-center max-md:items-center md:flex-col flex-col items-center text-gray-700 dark:text-gray-300">
          {header}
        </div>

        {/* Body */}
        <div className='w-full items-center justify-center border shadow border-gray-200 flex flex-col mt-3 md:mt-8 mb-2'>
          {body}
        </div>
        <hr className='text-gray-200'></hr>

        {/* Footer */}
        <div className='py-4 flex items-center justify-evenly'>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
