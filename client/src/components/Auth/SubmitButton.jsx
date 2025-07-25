import React from 'react';

function SubmitButton({ disabled, children }) {
  return (
    <>
      <button 
        disabled={disabled} // Change to true if you want to disable the button
        type="submit" 
        className={
          disabled 
            ? "w-80 flex items-center justify-center bg-gray-400 text-white font-semibold py-3 px-4 rounded-full cursor-not-allowed" 
            : "w-80 flex item-center justify-center bg-gradient-to-br from-green-800 to-green-500 text-white px-4 py-3 rounded-full text-sm hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:bg-green-500 transition cursor-pointer"}>
        {children}
      </button>
    </>
  );
}

export default SubmitButton;
