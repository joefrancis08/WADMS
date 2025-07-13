import React from 'react';

function AlertMessage({ message }) {
  return (
    <div>
      <p className="text-red-500 text-[14px] text-sm flex items-center mt-0.5 ml-1">
        <img className="mr-1 w-4 h-4" src="circle-alert.svg" alt="" />
        {message}
      </p>
    </div>
  )
}

export default AlertMessage;
