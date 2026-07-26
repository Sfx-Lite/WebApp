export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};

export type PaginatedNotifications = {
  items: NotificationItem[];
  total: number;
  limit: number;
  offset: number;
  unreadCount: number;
};
