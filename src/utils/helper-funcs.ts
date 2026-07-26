export function formatTransactionTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) {
    const time = date
      .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      .toLowerCase()
      .replace(" ", "");
    return `Today, ${time}`;
  }

  if (isSameDay(date, yesterday))
    return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatNotificationDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now))
    return "Today";
  if (isSameDay(date, yesterday))
    return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatNotificationTime(isoDate: string): string {
  return new Date(isoDate)
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function truncateAddress(address: string, start = 4, end = 4): string {
  if (address.length <= start + end)
    return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function truncateMiddle(value: string, start = 8, end = 6): string {
  if (value.length <= start + end)
    return value;
  return `${value.slice(0, start)}…${value.slice(-end)}`;
}
