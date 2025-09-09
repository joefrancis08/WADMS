const formatParameterName = (text) => {
  return text.split(/[.\-:]/)[0].trim();
}
export default formatParameterName;