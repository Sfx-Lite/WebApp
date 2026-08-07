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

export function truncateHash(hash: string, start = 6, end = 6): string {
  if (hash.length <= start + end)
    return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

export function truncateMiddle(value: string, start = 8, end = 6): string {
  if (value.length <= start + end)
    return value;
  return `${value.slice(0, start)}…${value.slice(-end)}`;
}

export function formatClockTime(date: Date): string {
  return date
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    .toLowerCase()
    .replace(" ", "");
}

export function formatHistoryTimestamp(isoDate: string): string {
  const date = new Date(isoDate);
  const time = date
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    .toLowerCase();
  const day = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  return `${time} · ${day}`;
}

export function formatMonthLabel(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
}

export function isValidEvmAddress(value: string): boolean {
  return /^0x[a-f0-9]{40}$/i.test(value.trim());
}

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1)
    return "Just now";
  if (diffMinutes < 60)
    return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24)
    return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7)
    return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
