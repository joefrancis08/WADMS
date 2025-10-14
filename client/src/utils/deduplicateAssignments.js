const deduplicateAssignments = (assignmentData, scope = 'area') => {
  // Suppose 'assignmentData' is your fetched data
  const uniqueAssignments = [];

  const seen = new Set();

  assignmentData.forEach((item) => {
    // Use a combination of taskForceID + areaID to check uniqueness
    const key = `${item.taskForceID}-${item[`${scope}ID`]}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueAssignments.push(item);
    }
  });

  return uniqueAssignments;
};

export default deduplicateAssignments;