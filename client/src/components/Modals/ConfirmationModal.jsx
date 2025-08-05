import ModalLayout from '../Layout/ModalLayout';
import { X } from 'lucide-react';

// Header
const ConfirmationModalHeader = ({ onClose, headerContent }) => {
  return (
    <>
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        aria-label="Close"
      >
        <X />
      </button>

      {headerContent}
    </>
  );
};

// Body
const ConfirmationModalBody = ({ bodyContent }) => {
  return (
    <>
      {bodyContent}
    </>
  );
};

// Footer
const ConfirmationModalFooter = ({ onCancelClick, onConfirmClick, isDelete = false, primaryButton, secondaryButton }) => {
  return (
    <>
      <button
        onClick={onCancelClick}
        className="mr-4 flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-400 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-gray-500 hover:to-gray-400 hover:shadow-lg active:opacity-50 transition cursor-pointer"
      >
        {secondaryButton}
      </button>
      
      <button
        onClick={onConfirmClick}
        className={`flex items-center justify-center text-white px-6 py-2 rounded-full text-sm hover:shadow-lg active:opacity-50 transition-all duration-300 cursor-pointer 
        ${isDelete ? 'bg-gradient-to-br from-red-800 to-red-500 hover:bg-gradient-to-tr hover:from-red-800 hover:to-red-500' : 'bg-gradient-to-br from-green-800 to-green-500 hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500'}`}
      >
        {primaryButton}
      </button>
    </>
  );
};

const ConfirmationModal = ({ onClose, headerContent, bodyContent, isDelete, primaryButton, secondaryButton, onCancelClick, onConfirmClick }) => {
  return (
    <ModalLayout
      onClose={onClose}
      header={<ConfirmationModalHeader onClose={onClose} headerContent={headerContent}/>}
      body={<ConfirmationModalBody bodyContent={bodyContent}/>}
      footer={<ConfirmationModalFooter isDelete={isDelete} primaryButton={primaryButton} secondaryButton={secondaryButton} onCancelClick={onCancelClick} onConfirmClick={onConfirmClick}/>}
      headerPosition={'justify-start max-md:items-start'}
      headerMargin={'mt-0'}
      bodyPosition={'justify-start'}
      bodyMargin={'my-4'}
      footerPosition={'justify-end'}
    />
  );
};

export default ConfirmationModal;
