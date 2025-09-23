import React from 'react';

const OTPField = (props) => {
  const { 
    autoFocus = false 
  } = props;
  return (

      <input 
        autoFocus={autoFocus}
        type="text"
        className='outline-slate-600 outline h-12 w-10 rounded text-center text-2xl font-semibold focus:outline-green-700 focus:outline-3 focus:shadow transition' 
      />
  );
};

export default OTPField;
