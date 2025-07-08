import React from 'react'

function SubmitButton({ children }) {
  return (
    <>
      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer">
        {children}
      </button>
    </>
  );
}

export default SubmitButton
