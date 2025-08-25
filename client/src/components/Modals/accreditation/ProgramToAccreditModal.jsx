import React from 'react';
import ModalLayout from '../../Layout/ModalLayout';
import { X } from 'lucide-react';

const Header = ({ onClose, headerContent }) => {
  return (
    <>
      {headerContent}
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

const Body = ({ bodyContent }) => {
  return (
    <>
      {bodyContent}
    </>
  );
};

const Footer = ({ footerContent }) => {
  return (
    <>
      {footerContent}
    </>
  );
};

const ProgramToAccreditModal = ({ onClose, headerContent, bodyContent, footerContent, mode = 'add' }) => {

  return (
    <ModalLayout
      onClose={onClose} 
      header={<Header onClose={onClose} headerContent={headerContent}/>}
      body={<Body bodyContent={bodyContent}/>}
      footer={<Footer footerContent={footerContent} />}
    />
  );
};

export default ProgramToAccreditModal;
