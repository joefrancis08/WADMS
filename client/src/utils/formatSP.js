function formatSubparameter(label, text) {
  // Extract the code before the first period and following number (e.g. A.1)
  const match = text.match(/^([A-Z]+\.\d+)/);
  if (match) {
    return `${label} ${match[1]}`;
  } else {
    return 'Invalid format';
  }
}

export default formatSubparameter;
