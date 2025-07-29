import { X } from "lucide-react";
import ModalLayout from "../Layout/ModalLayout";

// Header
const UpdateUserModalHeader = ({ onClose, headerContent }) => {
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
        {headerContent}
      </p>
    </>
  );
};

// Body
const UpdateUserModalBody = ({ bodyContent }) => {
  return (
    <>
      {bodyContent}
    </>
  );
};

// Footer 
const UpdateUserModalFooter = ({ onCancelClick, onSaveClick, primaryButton, secondaryButton }) => {
  return (
    <>
      <button
        onClick={onCancelClick}
        className="mr-4 flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-400 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-gray-500 hover:to-gray-400 hover:shadow-lg active:opacity-50 transition cursor-pointer"
      >
        {secondaryButton}
      </button>
      <button
        onClick={onSaveClick}
        className="flex items-center justify-center bg-gradient-to-br from-green-800 to-green-500 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50 transition cursor-pointer"
      >
        {primaryButton}
      </button>
    </>
  );
};

const UpdateUserModal = ({ 
  onClose, 
  onCancelClick, 
  onSaveClick, 
  headerContent, 
  bodyContent, 
  primaryButton, 
  secondaryButton 
}) => {
  return (
    <>
      <ModalLayout 
        onClose={onClose}
        header={<UpdateUserModalHeader onClose={onClose} headerContent={headerContent}/>}
        headerMargin={'mt-0'}
        headerPosition={'justify-start'}
        body={<UpdateUserModalBody bodyContent={bodyContent}/>}
        bodyMargin={'my-4'}
        bodyPosition={'justify-start'}
        footer={
          <UpdateUserModalFooter 
            onCancelClick={onCancelClick} 
            onSaveClick={onSaveClick} 
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
          />
        }
        footerPosition={'justify-end'}
      />
    </>
  );
};

export default UpdateUserModal;
