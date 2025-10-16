const formatParameterName = (text) => {
  if (typeof text !== 'string') return ''; // fallback
  return text.split(/[.\-:]/)[0].trim();
};

export default formatParameterName;
