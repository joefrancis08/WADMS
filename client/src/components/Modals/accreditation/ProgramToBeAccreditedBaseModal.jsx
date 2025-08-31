import React from 'react';
import ModalLayout from '../../Layout/ModalLayout';
import { X } from 'lucide-react';

const Header = ({ onClose, headerContent }) => {
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

const Body = ({ bodyContent }) => {
  return (
    <>
      {bodyContent}
    </>
  );
};

const Footer = ({ onCancel, onSave, primaryButton, disabled, secondaryButton }) => {
  return (
    <>
      <button
        onClick={onCancel}
        className="mr-4 flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-400 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-gray-500 hover:to-gray-400 hover:shadow-lg active:opacity-50 transition cursor-pointer"
      >
        {secondaryButton}
      </button>
      <button
        onClick={onSave}
        disabled={disabled}
        className={disabled 
          ? 'flex items-center justify-center bg-gray-500 text-white font-semibold py-2 px-6 rounded-full text-sm opacity-50 cursor-not-allowed transition'
          : 'flex items-center justify-center bg-gradient-to-br from-green-800 to-green-500 text-white px-6 py-2 rounded-full text-sm hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50 transition cursor-pointer'}
      >
        {primaryButton}
      </button>
    </>
  );
};

const ProgramToBeAccreditedBaseModal = (
  { 
    onClose, onCancel, onSave, headerContent, 
    bodyContent, primaryButton, disabled, 
    secondaryButton, mode = 'add' 
  }
) => {
  return (
    <ModalLayout
      onClose={onClose} 
      header={<Header onClose={onClose} headerContent={headerContent}/>}
      body={<Body bodyContent={bodyContent}/>}
      footer={<Footer onCancel={onCancel} onSave={onSave} primaryButton={primaryButton} disabled={disabled} secondaryButton={secondaryButton} />}
      footerMargin={'mb-8 mr-6'}
      footerPosition={'justify-end'}
    />
  );
};

export default ProgramToBeAccreditedBaseModal;
