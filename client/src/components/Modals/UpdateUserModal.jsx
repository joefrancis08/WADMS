import { X } from "lucide-react";
import ModalLayout from "../Layout/ModalLayout";

// Header
const UpdateUserModalHeader = ({ onClose, headerContent }) => {
  return (
    <>
      <p className="text-2xl font-bold text-gray-800">
        {headerContent}
      </p>
      <button
        onClick={onClose}
        className="text-gray-600 p-3 rounded-full transition cursor-pointer hover:bg-slate-200 active:opacity-75"
        aria-label="Close"
      >
        <X />
      </button>
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
const UpdateUserModalFooter = ({ 
  onCancelClick, 
  onSaveClick, 
  primaryButton, 
  secondaryButton, 
  disabled }) => {
  return (
    <>
      <button
        onClick={onCancelClick}
        className="mr-4 flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-400 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-gray-500 hover:to-gray-400 hover:shadow-lg active:opacity-50 transition cursor-pointer"
      >
        {secondaryButton}
      </button>
      <button
        type='submit'
        disabled={disabled}
        onClick={onSaveClick}
        className={disabled 
          ? 'flex items-center justify-center bg-gray-500 text-white font-semibold py-2 px-6 rounded-full text-sm opacity-50 cursor-not-allowed transition'
          : 'flex items-center justify-center bg-gradient-to-br from-green-800 to-green-500 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50 transition cursor-pointer'}
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
  disabled = false,
  secondaryButton 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    !disabled && onSaveClick(e);
  }

  return (
    <>
      <ModalLayout 
        onClose={onClose}
        header={<UpdateUserModalHeader onClose={onClose} headerContent={headerContent}/>}
        headerMargin={'mt-0'}
        headerPosition={'justify-start'}
        bodyMargin={'mt-2 mb-3'}
        bodyPosition={'justify-start'}
        body={
          <form 
            onSubmit={handleSubmit} 
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit(e);
            }
          }>
            <UpdateUserModalBody bodyContent={bodyContent}/>

            <div className='flex justify-end mt-6'>
              <UpdateUserModalFooter 
                onCancelClick={onCancelClick} 
                primaryButton={primaryButton}
                disabled={disabled}
                secondaryButton={secondaryButton}
              />
            </div>
            
          </form>
        }
      />
    </>
  );
};

export default UpdateUserModal;
