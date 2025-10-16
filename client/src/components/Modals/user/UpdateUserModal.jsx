import { X } from "lucide-react";
import ModalLayout from "../../Layout/ModalLayout";
import Popover from "../../Popover";

// Header
const UpdateUserModalHeader = ({ onClose, headerContent }) => {
  return (
    <>
      <p className="text-lg font-medium text-slate-800">
        {headerContent}
      </p>
      <button
        onClick={onClose}
        className="text-gray-800 p-2 -mr-2 rounded-full transition cursor-pointer hover:bg-slate-200 active:opacity-75"
        aria-label="Close"
      >
        <X className='h-5 w-5'/>
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
  disabled,
  disabledMessage
}) => {
  return (
    <>
      <button
        onClick={onCancelClick}
        className="min-w-20 mr-4 flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-400 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-gray-500 hover:to-gray-400 hover:shadow-lg active:opacity-50 transition cursor-pointer"
      >
        {secondaryButton}
      </button>
      <button
        title={disabled && disabledMessage}
        type='submit'
        disabled={disabled}
        onClick={onSaveClick}
        className={disabled 
          ? 'min-w-30 flex items-center justify-center bg-gray-500 text-white font-semibold py-2 px-6 rounded-full text-sm opacity-50 cursor-not-allowed transition'
          : 'min-w-30 flex items-center justify-center bg-gradient-to-br from-green-800 to-green-500 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50 transition cursor-pointer'}
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
  disabledMessage,
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
        footerMargin={'mb-3'}
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
                disabledMessage={disabledMessage}
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
