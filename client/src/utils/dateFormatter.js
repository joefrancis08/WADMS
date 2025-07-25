function dateFormatter(date) {
  const utcDate = new Date(date);

  const options = {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  };

  const phTime = utcDate.toLocaleString('en-US', options);

  return phTime;
}

export default dateFormatter;