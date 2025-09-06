import { parse, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const TIMEZONE = 'Asia/Manila';

/**
 * Parse a raw string into YYYY-MM-DD (Asia/Manila)
 */
const parseDate = (dateStr) => {
  const formats = ['MMMM d, yyyy', 'MMMM dd, yyyy'];
  for (const fmt of formats) {
    const parsed = parse(dateStr, fmt, new Date());
    if (isValid(parsed)) {
      return formatInTimeZone(parsed, TIMEZONE, 'yyyy-MM-dd');
    }
  }
  throw new Error(`Invalid date string: '${dateStr}'`);
}

/*
  Parse accreditation period strings into [start, end] in YYYY-MM-DD
 *
  Supported formats:
  - January 20-22, 2025
  - August 29 - September 02, 2025
  - August 29, 2025 - August 29, 2026
  - August 29, 2025
 */
const parseAccreditationPeriod = (humanDate) => {
  if (!humanDate || typeof humanDate !== 'string') {
    throw new Error('Date input must be a non-empty string');
  }

  // Normalize whitespace: collapse multiple spaces into one
  // and trim leading/trailing spaces
  humanDate = humanDate.replace(/\s+/g, ' ').trim();

  let match;

  // Case 1: January 20-22, 2025
  match = /^([A-Za-z]+) (\d{1,2})-(\d{1,2}), (\d{4})$/.exec(humanDate);
  if (match) {
    const [, month, d1, d2, year] = match;
    return [parseDate(`${month} ${d1}, ${year}`), parseDate(`${month} ${d2}, ${year}`)];
  }

  // Case 2: August 29 - September 02, 2025
  match = /^([A-Za-z]+ \d{1,2}) - ([A-Za-z]+ \d{1,2}), (\d{4})$/.exec(humanDate);
  if (match) {
    const [, start, end, year] = match;
    return [parseDate(`${start}, ${year}`), parseDate(`${end}, ${year}`)];
  }

  // Case 3: August 29, 2025 - August 29, 2026
  match = /^([A-Za-z]+ \d{1,2}, \d{4}) - ([A-Za-z]+ \d{1,2}, \d{4})$/.exec(humanDate);
  if (match) {
    const [, start, end] = match;
    return [parseDate(start), parseDate(end)];
  }

  // Case 4: August 29, 2025 (single day)
  match = /^([A-Za-z]+ \d{1,2}, \d{4})$/.exec(humanDate);
  if (match) {
    const date = parseDate(match[1]);
    return [date, date];
  }

  throw new Error(`Unrecognized date format: '${humanDate}'`);
}

export default parseAccreditationPeriod;
