import React from 'react'

const Popover = ({ handleInfoClick, handleMouseEnter, handleMouseLeave, content, position = 'top-3 left-52' }) => {
  return (
    <div 
      onClick={handleInfoClick}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      className={`w-60 h-auto bg-slate-800 absolute rounded z-50 transition-opacity duration-500
        ${position}
      `}>
      {content}
    </div>
  );
};

export default Popover;
