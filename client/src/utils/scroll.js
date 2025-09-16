// src/utils/scroll.js

// Save scroll position to localStorage
export const saveScrollPosition = (key = "scrollPosition") => {
  localStorage.setItem(key, window.scrollY.toString());
};

// Restore scroll position from localStorage
export const restoreScrollPosition = (key = "scrollPosition") => {
  const storedPosition = localStorage.getItem(key);
  if (storedPosition) {
    window.scrollTo(0, parseInt(storedPosition, 10));
  }
};

// Clear scroll position
export const clearScrollPosition = (key = "scrollPosition") => {
  localStorage.removeItem(key);
};
