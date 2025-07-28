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
const ConfirmationModalBody = ({ selectedUser }) => {
  return (
    <p className="mb-4 text-gray-800">
      Are you sure you want to verify {selectedUser?.full_name}?
    </p>
  );
};

// Footer
const ConfirmationModalFooter = ({ onCancelClick, onConfirmClick }) => {
  return (
    <>
      <button
        onClick={onCancelClick}
        className="mr-4 flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-400 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-gray-500 hover:to-gray-400 hover:shadow-lg active:opacity-50 transition cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={onConfirmClick}
        className="flex items-center justify-center bg-gradient-to-br from-green-800 to-green-500 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50 transition cursor-pointer"
      >
        Confirm
      </button>
    </>
  );
};

const ConfirmationModal = ({ selectedUser, onClose, onCancelClick, onConfirmClick }) => {
  return (
    <ModalLayout
      onClose={onClose}
      header={<ConfirmationModalHeader onClose={onClose}/>}
      body={<ConfirmationModalBody selectedUser={selectedUser}/>}
      footer={<ConfirmationModalFooter onCancelClick={onCancelClick} onConfirmClick={onConfirmClick}/>}
      headerPosition={'justify-start max-md:items-start'}
      headerMargin={'mt-0'}
      bodyPosition={'justify-start'}
      bodyMargin={'my-4'}
      footerPosition={'justify-end'}
    />
  );
};

export default ConfirmationModal;
