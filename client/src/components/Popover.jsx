import React from 'react'

const Popover = ({ handleInfoClick, content, position = 'top-3 left-52' }) => {
  return (
    <div 
      onClick={handleInfoClick} 
      className={`w-40 h-auto bg-slate-800 absolute rounded z-40 transition-opacity duration-500
        ${position}
      `}>
      {content}
    </div>
  );
};

export default Popover;
