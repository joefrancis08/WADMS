import { useEffect, useState } from "react";
import dateFormatter from "../utils/dateFormatter";

const TimeAgo = ({ date, action = '' }) => {
  const [timeAgo, setTimeAgo] = useState(() => (
    dateFormatter(action, date)
  ));

  useEffect(() => {
    if (!date) return;

    const interval = setInterval(() => {
      setTimeAgo(dateFormatter(action, date));
    }, 60000);

    setTimeAgo(dateFormatter(action, date));

    return () => clearInterval(interval);
  }, [date, action]);

  return (
    <span>{timeAgo}</span>
  );
}

export default TimeAgo;
