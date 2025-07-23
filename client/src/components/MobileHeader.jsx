import React from 'react';
import { menuIconDark } from '../assets/icons';

const MobileHeader = ({ onMenuClick }) => {
  return (
    <>
      <div className='mh-container'>
        <button 
          onClick={() => onMenuClick(true)}
          className='mh-menu-button'>
          <img className='mh-menu-svg' src={menuIconDark} alt="Menu icon" />
        </button>
        <div className='mh-logo-and-title-container'>
          <img className='w-14 h-auto' src="/CGS_Logo.png" alt="" />
          <h1 className='text-2xl font-bold'>DMS</h1>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
