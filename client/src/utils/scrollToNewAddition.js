const scrollToNewAddition = (key, value, getBy = 'id') => {
  localStorage.setItem(key, value);

  setTimeout(() => {
    const val = localStorage.getItem(key);
    if (val) {
      let el;

      if (getBy === 'id') {
        el = document.getElementById(val);
      } else if (getBy === 'className') {
        el = document.getElementsByClassName(val)[0];
      } else {
        console.error('Unrecognized option.');
      }

      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }
  }, 100); // Small delay to wait for render
};

export default scrollToNewAddition;
