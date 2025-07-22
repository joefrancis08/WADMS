import React from 'react';
import { menuIconDark } from '../assets/icons';

const MobileHeader = ({ onMenuClick }) => {
  return (
    <>
      <div className='max-sm:flex max-md:flex md:hidden items-center justify-start space-x-5 p-4 bg-gray-200 shadow-md sticky top-0 border-b border-gray-300 h-18 z-40'>
        <button 
          onClick={() => onMenuClick(true)}
          className='p-2 hover:bg-gray-300 hover:rounded-full hover:shadow-sm cursor-pointer'>
          <img className='opacity-100 hover:opacity-75 w-8 h-8' src={menuIconDark} alt="Menu icon" />
        </button>
        <div className='flex items-center space-x-2'>
          <img className='w-14 h-auto' src="/CGS_Logo.png" alt="" />
          <h1 className='text-2xl font-bold'>WDMS</h1>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
