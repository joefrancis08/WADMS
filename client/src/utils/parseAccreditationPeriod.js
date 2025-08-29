import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { parse } from 'date-fns';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'Asia/Manila';

const parseAccreditationPeriod = (humanDate) => {
  // Remove extra spaces
  humanDate = humanDate.trim();

  let start, end;

  // Case: "August 29-30, 2025"
  if (humanDate.match(/^[A-Za-z]+ \d{1,2}-\d{1,2}, \d{4}$/)) {
    const [month, rest] = humanDate.split(' ');
    const [daysPart, yearPart] = rest.split(',').map(s => s.trim());
    const [startDay, endDay] = daysPart.split('-').map(Number);
    const year = Number(yearPart);

    start = dayjs(`${year}-${month}-${startDay}`, 'YYYY-MMMM-D').tz(TIMEZONE).format('YYYY-MM-DD');
    end = dayjs(`${year}-${month}-${endDay}`, 'YYYY-MMMM-D').tz(TIMEZONE).format('YYYY-MM-DD');
  }
  // Case: "August 29 - September 02, 2025"
  else if (humanDate.match(/^[A-Za-z]+ \d{1,2} - [A-Za-z]+ \d{1,2}, \d{4}$/)) {
    const [startPart, endPartYear] = humanDate.split(' - ');
    const [endPart, yearPart] = endPartYear.split(',').map(s => s.trim());

    const [startMonth, startDay] = startPart.split(' ');
    const [endMonth, endDay] = endPart.split(' ');

    const year = Number(yearPart);

    start = dayjs(`${year}-${startMonth}-${startDay}`, 'YYYY-MMMM-D').tz(TIMEZONE).format('YYYY-MM-DD');
    end = dayjs(`${year}-${endMonth}-${endDay}`, 'YYYY-MMMM-D').tz(TIMEZONE).format('YYYY-MM-DD');
  }
  // Case: "August 29, 2025 - August 29, 2026"
  else if (humanDate.match(/^[A-Za-z]+ \d{1,2}, \d{4} - [A-Za-z]+ \d{1,2}, \d{4}$/)) {
    const [startPart, endPart] = humanDate.split(' - ');

    const start = dayjs(startPart, 'MMMM D, YYYY').tz(TIMEZONE).format('YYYY-MM-DD');
    const end = dayjs(endPart, 'MMMM D, YYYY').tz(TIMEZONE).format('YYYY-MM-DD');
    
    return [start, end];
  } 
  else {
    throw new Error("Unrecognized date format");
  }

  return [start, end];
};

export default parseAccreditationPeriod;
