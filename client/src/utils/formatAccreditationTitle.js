function formatAccreditationTitle(str, options = {}) {
  if (str && options?.isForUI) {
    const firstSpaceIndex = str.indexOf(' ');
    if (firstSpaceIndex === -1) {
      // No space found, return the string as first and empty rest
      return [str, ''];
    }
    const first = str.substring(0, firstSpaceIndex);
    const rest = str.substring(firstSpaceIndex + 1);
    return [first, rest];

  } else if (str && options?.isForDB) {
    const match = str.match(/^(.*)\s(\d{4})$/);

    if (match) {
      const title = match[1];
      const year = match[2];

      return [title, year];
    } else {
      console.error('Format not recognized');
    }

  } else {
    console.error('Options are required.');
  }
  
}

export default formatAccreditationTitle;