import React from 'react';
import Icons from '../../assets/icons';

function AlertMessage({ message }) {
  return (
    <div>
      <p className="text-red-500 text-[14px] text-sm flex items-center mt-0.5 ml-1">
        <img className="mr-1 w-4 h-4" src={Icons.circleAlert} alt="Circle Alert" />
        {message}
      </p>
    </div>
  )
}

export default AlertMessage;
