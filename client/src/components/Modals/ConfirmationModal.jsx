import ConfirmationModalLayout from '../Layout/ConfirmationModalLayout';
import ModalLayout from '../Layout/ModalLayout';
import { X } from 'lucide-react';

// Header
const ConfirmationModalHeader = ({ onClose, headerContent }) => {
  return (
    <>
      {headerContent}
      <button
        onClick={onClose}
        className="text-gray-800 p-3 rounded-full transition cursor-pointer hover:bg-slate-200 active:opacity-75"
        aria-label="Close"
      >
        <X className='h-5 w-5'/>
      </button>
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
        className="flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-400 text-white px-10 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-gray-500 hover:to-gray-400 hover:shadow-lg active:opacity-50 transition cursor-pointer"
      >
        {secondaryButton}
      </button>
      
      <button
        onClick={onConfirmClick}
        className={`flex items-center justify-center text-white px-10 py-2 rounded-full text-sm hover:shadow-lg active:opacity-50 transition-all duration-300 cursor-pointer 
        ${isDelete ? 'bg-gradient-to-br from-red-700 to-red-500 hover:bg-gradient-to-tr hover:from-red-700 hover:to-red-500' : 'bg-gradient-to-br from-green-800 to-green-500 hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500'}`}
      >
        {primaryButton}
      </button>
    </>
  );
};

const ConfirmationModal = ({ onClose, headerContent, bodyContent, isDelete, primaryButton, secondaryButton, onCancelClick, onConfirmClick }) => {
  return (
    <ConfirmationModalLayout
      onClose={onClose}
      header={<ConfirmationModalHeader onClose={onClose} headerContent={headerContent}/>}
      body={<ConfirmationModalBody bodyContent={bodyContent}/>}
      footer={<ConfirmationModalFooter isDelete={isDelete} primaryButton={primaryButton} secondaryButton={secondaryButton} onCancelClick={onCancelClick} onConfirmClick={onConfirmClick}/>}
      headerPosition={'justify-center max-md:items-center'}
      headerMargin={'mt-0'}
      bodyPosition={'justify-center'}
      bodyMargin={'my-0'}
      footerMargin={'pb-4'}
      footerPosition={'justify-center'}
    />
  );
};

export default ConfirmationModal;
