const formatProgramParams = (dateRange, levelSlug, programSlug) => {
  // Split start and end date
  const startDate = dateRange.substring(0, 8);
  const endDate = dateRange.substring(8, 16);

  // Format YYYYMMDD -> YYYY-MM-DD
  let formatDate = (d) => (
    `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 8)}`
  );
  
  // Capitalize first letter of a word
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    level: capitalize(levelSlug),
    program: String(programSlug)
      .split('-')
      .map(capitalize)
      .join(' ')
  };
};

export default formatProgramParams;