import React from 'react'

const Popover = ({ handleInfoClick, handleMouseEnter, handleMouseLeave, content, position = '' }) => {
  return (
    <p 
      onClick={handleInfoClick}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      className={`w-50 h-auto bg-slate-800 absolute rounded-lg border border-slate-600 z-50 transition-opacity duration-500 p-2 text-slate-100 text-xs text-center
        ${position}
      `}>
      {content}
    </p>
  );
};

export default Popover;
