const formatProgramParams = (dateRange, levelSlug, programSlug) => {
  const startDate = dateRange.substring(0, 8);
  const endDate   = dateRange.substring(8, 16);

  const formatDate = (d) => `${d.substring(0,4)}-${d.substring(4,6)}-${d.substring(6,8)}`;

  // Capitalize each word
  const capitalizeWords = (str) =>
    str
      .replace(/-/g, ' ')   // replace hyphens with space
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    level: capitalizeWords(levelSlug),
    program: capitalizeWords(programSlug.replace(/-/g, ' '))
  };
};

export default formatProgramParams;
