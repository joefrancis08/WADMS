import React from 'react';
import { circleAlertIcon } from '../../assets/icons';

function AlertMessage({ message }) {
  return (
    <>
      <p className="text-red-500 text-[13px] text-sm flex items-center mt-0.5 ml-1">
        <img className="mr-1 w-4 h-4" src={circleAlertIcon} alt="Circle Alert" />
        {message}
      </p>
    </>
  )
}

export default AlertMessage;
