import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import isYesterday from 'dayjs/plugin/isYesterday';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(isYesterday);
dayjs.extend(localizedFormat);

const TIMEZONE = 'Asia/Manila';

function dateFormatter(action = '', date) {
  const now = dayjs().tz(TIMEZONE);
  const target = dayjs(date).tz(TIMEZONE);

  const diffMinutes = now.diff(target, 'minute');
  const diffHours = now.diff(target, 'hour');

  if (diffMinutes < 1) {
    return (
      action 
      ? `${action} Just now` 
      : 'Just now'
    );

  } else if (target.isYesterday()) {
    return (
      action 
      ? `${action} Yesterday at ${target.format('h:mm A')}`
      : `Yesterday at ${target.format('h:mm A')}`
    );

  } else if (diffHours < 24) {
    return (
      action 
      ? `${action} ${target.fromNow()}` 
      : `${target.fromNow()}`
    );

  } else {
    return (
      action 
      ? `${action} on ${target.format('MMMM D, YYYY [at] h:mm A')}` 
      : `${target.format('MMMM D, YYYY [at] h:mm A')}`
    );
  }
}

export default dateFormatter;
