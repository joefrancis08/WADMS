const isValidDateFormat = (dateString) => {
  // Match YYYY-MM-DD strictly
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(dateString)) return false;

  // Extra check: invalid dates like 2025-02-30
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10) === dateString;
};

export default isValidDateFormat;
