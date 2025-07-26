import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const UserProfileModal = ({ onClose, header, body, footer }) => {

  return (
    <div className="h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg p-4">
      <div className="relative w-full md:max-w-xl bg-gradient-to-r from-gray-100 to-white rounded-md shadow-2xl px-8 pt-8 animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={() => {
            onClose?.();
          }}
        >
        </button>

        {/* Header */}
        <div className="flex justify-center border border-gray-300 rounded-md max-md:items-center md:flex-col flex-col items-center text-gray-700 dark:text-gray-300 mt-4">
          {header}
        </div>

        {/* Body */}
        <div className='w-full items-center justify-center rounded-md shadow border border-gray-300 flex flex-col my-4 md:my-8'>
          {body}
        </div>
        <hr className='text-gray-300'></hr>

        {/* Footer */}
        <div className='py-4 flex items-center justify-evenly'>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
