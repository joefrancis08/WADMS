import React from 'react'
import ModalLayout from '../Layout/ModalLayout';
import { X } from 'lucide-react';

// Header
const ConfirmationModalHeader = ({ onClose }) => {
  return (
    <>
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        aria-label="Close"
      >
        <X />
      </button>

      <p className="text-2xl font-bold text-gray-800">
        Confirm Verification
      </p>
    </>
  );
};
// Body
// Footer

const ConfirmationModal = ({ selectedUser, onClose, onConfirmClick, onCancelClick }) => {
  return (
    <ModalLayout
      onClose={onClose}
      header={<ConfirmationModalHeader onClose={onClose}/>}
      body={
        <p className="mb-4 text-gray-800">
          Are you sure you want to verify {selectedUser?.full_name}?
        </p>
      }
      footer={
        <>
          <button
            onClick={onCancelClick}
            className="mr-4 px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmClick}
            className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          >
            Confirm
          </button>
        </>
        
      }
      headerPosition={'justify-start max-md:items-start'}
      headerMargin={'mt-0'}
      bodyPosition={'justify-start'}
      bodyMargin={'my-4'}
      footerPosition={'justify-end'}
    />
  );
};

export default ConfirmationModal;
