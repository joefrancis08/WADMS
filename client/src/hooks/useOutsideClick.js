/* 
  This code will make something gone when clicking outside of it.
  I used lot of code like this so I make it a hook so that I can
  reuse it. This is good for modal and dropdown because commonly
  it should be gone when clicking outside of it.
*/

import { useEffect } from "react";

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(); // Call close function
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, callback]);
};

export default useOutsideClick;