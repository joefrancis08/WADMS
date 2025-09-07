const formatProgramParams = (dateRange, levelSlug, programSlug, areaSlug) => {
  console.log(areaSlug);
  const startDate = dateRange.substring(0, 8);
  const endDate   = dateRange.substring(8, 16);

  const formatDate = (d) =>
    `${d.substring(0,4)}-${d.substring(4,6)}-${d.substring(6,8)}`;

  // Words to keep lowercase unless first word
  const smallWords = ['of', 'in', 'on', 'at', 'to', 'and', 'the', 'a', 'an'];

  const capitalizeWords = (str = '') =>
    str
      .replace(/-/g, " ")
      .split(" ")
      .map((word, idx) => {
        const lower = word.toLowerCase();

        // Fully uppercase roman numerals
        if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(word)) {
          return word.toUpperCase();
        }

        // Keep small words lowercase (unless first word)
        if (idx !== 0 && smallWords.includes(lower)) {
          return lower;
        }

        // Normal capitalization
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(" ");

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    level: capitalizeWords(levelSlug),
    program: capitalizeWords(programSlug),
    area: areaSlug ? capitalizeWords(areaSlug) : ''
  };
};

export default formatProgramParams;
