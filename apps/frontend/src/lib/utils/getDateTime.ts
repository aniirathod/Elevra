export interface DateTimeData {
  fullDateTime: string; // e.g. "2025-11-05 23:45:12"
  date: string; // e.g. "2025-11-05"
  time: string; // e.g. "23:45:12"
  year: string; // e.g. "2025"
  month: string; // e.g. "11"
  day: string; // e.g. "05"
  formatted: string; // e.g. "Nov 5, 2025 - 11:45 PM"
}

/**
 * Utility to get real-time date/time info.
 * Supports extracting specific parts like year, time, or a formatted string.
 */
export function getDateTime(): DateTimeData {
  const now = new Date();

  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const date = `${year}-${month}-${day}`;
  const time = `${hours}:${minutes}:${seconds}`;
  const fullDateTime = `${date} ${time}`;
  const formatted = now.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return { fullDateTime, date, time, year, month, day, formatted };
}
