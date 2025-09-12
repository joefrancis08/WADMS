function formatAccreditationTitle(str) {
  const firstSpaceIndex = str.indexOf(" ");
  if (firstSpaceIndex === -1) {
    // No space found, return the string as first and empty rest
    return [str, ''];
  }
  const first = str.substring(0, firstSpaceIndex);
  const rest = str.substring(firstSpaceIndex + 1);
  return [first, rest];
}

export default formatAccreditationTitle;