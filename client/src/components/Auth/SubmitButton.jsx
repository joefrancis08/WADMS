import React from 'react';

function SubmitButton({ disabled, children }) {
  return (
    <>
      <button 
        disabled={disabled} // Change to true if you want to disable the button
        type="submit" 
        className={
          disabled 
            ? "w-full flex items-center justify-center bg-gray-400 text-white font-semibold py-2 px-4 rounded cursor-not-allowed" 
            : "w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded cursor-pointer hover:shadow-lg"}>
        {children}
      </button>
    </>
  );
}

export default SubmitButton;
