import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with UTC plugin (allows handling of UTC time)
dayjs.extend(utc);

// Extend dayjs with timezone plugin (allows conversion to specific timezones)
dayjs.extend(timezone);

// Define the timezone to be used
const TIMEZONE = 'Asia/Manila';

const formatAccreditationPeriod = (startDate, endDate) => {
  // Parse the start and end dates using dayjs and set timezone
  const start = dayjs(startDate).tz(TIMEZONE);
  const end = dayjs(endDate).tz(TIMEZONE);

  // Case 1: If start and end are the same day
  if (start.isSame(end, 'day')) {
    return start.format('MMMM D, YYYY');
  }

  // Case 2: If start and end are in the same month and year
  // Example: August 27-30, 2025
  if (start.month() === end.month() && start.year() === end.year()) {
    return `${start.format('MMMM D')}-${end.format('D, YYYY')}`;
  }

  // Case 3: If start and end are in the same year but different months
  // Example: August 31 - September 3, 2025
  if (start.year() === end.year()) {
    return `${start.format('MMMM D')} - ${end.format('MMMM D, YYYY')}`
  }

  // Case 4: If start and end are in different years
  // Example: December 30, 2025 - January 2, 2026
  return `${start.format('MMMM D, YYYY')} - ${end.format('MMMM D, YYYY')}`;
};

export default formatAccreditationPeriod;