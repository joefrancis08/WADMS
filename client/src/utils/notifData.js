// utils/dates.ts
export const MANILA_TZ = "Asia/Manila";
export const DEFAULT_LOCALE = "en-US";

export function humanizeCalendarDay(
  input,
  tz = MANILA_TZ,
  locale = DEFAULT_LOCALE
) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";

  // Get Y/M/D in target timezone (avoids DST/midnight bugs)
  const parts = (d) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    })
      .formatToParts(d)
      .reduce((acc, p) => ((acc[p.type] = p.value), acc), {});

  const a = parts(date);
  const b = parts(new Date());

  const toUTC = (y, m, d ) => Date.UTC(+y, +m - 1, +d);
  const diffDays = Math.round(
    (toUTC(b.year, b.month, b.day) - toUTC(a.year, a.month, a.day)) / 86_400_000
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  // Otherwise: "October 21, 2025"
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz, month: "long", day: "numeric", year: "numeric",
  }).format(date);
}

export function formatClock(
  input,
  tz = MANILA_TZ,
  locale = DEFAULT_LOCALE
) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz, hour: "numeric", minute: "2-digit",
  }).format(new Date(input));
}
