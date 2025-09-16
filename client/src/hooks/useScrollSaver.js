import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SCROLL_KEY = "scrollPositions";

export default function useScrollSaver(containerRef) {
  const location = useLocation();

  // Restore scroll on mount or route change
  useEffect(() => {
    if (!containerRef?.current) return;

    const scrollPositions = JSON.parse(localStorage.getItem(SCROLL_KEY)) || {};
    const saved = scrollPositions[location.pathname] || 0;

    // Restore AFTER render
    requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = saved;
      }
    });
  }, [location.pathname, containerRef]);

  // Save scroll position whenever the user scrolls
  useEffect(() => {
    if (!containerRef?.current) return;
    const el = containerRef.current;

    const handleScroll = () => {
      const scrollPositions = JSON.parse(localStorage.getItem(SCROLL_KEY)) || {};
      scrollPositions[location.pathname] = el.scrollTop;
      localStorage.setItem(SCROLL_KEY, JSON.stringify(scrollPositions));
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [location.pathname, containerRef]);
}
