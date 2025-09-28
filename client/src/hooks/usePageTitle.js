import { useEffect } from "react";

const usePageTitle = (title) => {
  return useEffect(() => {
    document.title = title;
  }, [title]);
};

export default usePageTitle;