import { useEffect, useRef } from "react";

function useAutoFocus(dependency, condition = true, options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (condition && ref.current) {
      if (options.forDateInput) {
        ref.current.setFocus();
      } else {
        ref.current.focus();
      }
    }
  }, [dependency, condition, options]);

  return ref;
}

export default useAutoFocus;
