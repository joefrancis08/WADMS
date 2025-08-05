import React from 'react'

const Header = ({  onClose, headerContent }) => {
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

const Body = ({ bodyContent }) => {
  return (
    <>
      {bodyContent}
    </>
  );
};

const Footer = ({ onCancelClick, onAddClick, primaryButton, disabled, secondaryButton }) => {
  return (
    <>
      <button
        onClick={onCancelClick}
        className="mr-4 flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-400 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-gray-500 hover:to-gray-400 hover:shadow-lg active:opacity-50 transition cursor-pointer"
      >
        {secondaryButton}
      </button>
      <button
        disabled={disabled}
        onClick={onAddClick}
        className={disabled 
          ? 'flex items-center justify-center bg-gray-500 text-white font-semibold py-2 px-6 rounded-full text-sm opacity-50 cursor-not-allowed transition'
          : 'flex items-center justify-center bg-gradient-to-br from-green-800 to-green-500 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50 transition cursor-pointer'}
      >
        {primaryButton}
      </button>
    </>
  );
};

const AddUserModal = () => {
  return (
    <div>
      
    </div>
  );
};

export default AddUserModal;
