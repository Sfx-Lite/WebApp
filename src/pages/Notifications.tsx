/* eslint-disable react/no-array-index-key */
/* eslint-disable react/exhaustive-deps */
import type { NotificationItem } from "@/lib/types/notifications";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router";
import {
  useListNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/api/notifications";
import NotificationSkeleton from "@/components/global/emptyStates/NotificationsEmptyState";
import NotificationAvatar from "@/components/Notifications/NotificationAvatar";
import { formatNotificationDate, formatNotificationTime } from "@/utils/helper-funcs";

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | string>("all");

  const { data, isLoading } = useListNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  const notifications = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  const typeTabs = useMemo(() => {
    const uniqueTypes = Array.from(new Set(notifications.map(n => n.type)));
    return uniqueTypes.map(type => ({
      id: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }, [notifications]);

  const hasUnreadForType = (type: string) =>
    notifications.some(n => n.type === type && !n.readAt);

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? notifications
        : notifications.filter(n => n.type === activeTab),
    [activeTab, notifications],
  );

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, NotificationItem[]>>((acc, item) => {
      const dateLabel = formatNotificationDate(item.createdAt);
      acc[dateLabel] = acc[dateLabel] ? [...acc[dateLabel], item] : [item];
      return acc;
    }, {});
  }, [filtered]);

  const handleMarkAllAsRead = () => {
    markAllRead();
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!item.readAt)
      markRead(item.id);
  };

  return (
    <section>
      <div className="space-y-[1.5rem]">
        <div className="flex items-center justify-between border-b border-sfx-primary-tint/30 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-[10px] rounded-full bg-sfx-card"
            >
              <MdArrowBack className="text-[20px]" />
            </button>
            <h1 className="font-rh-b text-[18px] text-sfx-ink">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-[13px] font-rh-m text-sfx-danger">
                  {unreadCount}
                  {" "}
                  new
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 border-b border-sfx-primary-tint/30">
              {[{ id: "all", label: "All" }, ...typeTabs].map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative rounded-full px-6 py-1.5 font-rh-b text-[15px] transition-colors"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-tab-pill"
                        className="absolute inset-0 rounded-full bg-white shadow-brand"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}

                    <span
                      className={`relative z-10 ${
                        isActive ? "text-sfx-primary-strong" : "text-sfx-ink"
                      }`}
                    >
                      {tab.label}
                    </span>

                    {tab.id !== "all" && hasUnreadForType(tab.id) && (
                      <span className="absolute -right-0.5 top-1 z-10 size-2 rounded-full bg-sfx-danger" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll || unreadCount === 0}
              className="w-fit mt-4 md:mt-0 font-rh-b text-[15px] text-sfx-primary-strong underline disabled:opacity-40 disabled:no-underline"
            >
              Mark all as read
            </button>
          </div>

          {isLoading
            ? (
                <div className="divide-y divide-sfx-primary-tint/25 overflow-hidden rounded-card bg-white shadow-brand">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <NotificationSkeleton key={i} />
                  ))}
                </div>
              )
            : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, filter: "blur(6px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-4"
                  >
                    {Object.entries(grouped).map(([date, items]) => (
                      <div key={date}>
                        <span className="font-rh-b text-[15px] text-sfx-ink">
                          {date}
                        </span>

                        <div className="mt-3 divide-y divide-sfx-primary-tint/25 overflow-hidden rounded-card bg-white shadow-brand">
                          {items.map((item, index) => (
                            <motion.button
                              key={item.id}
                              onClick={() => handleItemClick(item)}
                              initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
                              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                              transition={{
                                duration: 0.25,
                                delay: index * 0.04,
                                ease: "easeOut",
                              }}
                              className="w-full flex items-start gap-3 p-(--spacing-card-pad) text-left"
                            >
                              <NotificationAvatar unread={!item.readAt} />

                              <div className="min-w-0 flex-1">
                                <p className="font-rh-b text-[15px] text-sfx-ink">
                                  {item.title}
                                </p>
                                <p className="mt-1 text-[14px] leading-[18px] text-sfx-muted">
                                  {item.body}
                                </p>
                              </div>

                              <span className="shrink-0 text-[13px] text-sfx-muted">
                                {formatNotificationTime(item.createdAt)}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {filtered.length === 0 && (
                      <p className="py-10 text-center text-[14px] text-sfx-muted">
                        No notifications in this category yet.
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
        </div>
      </div>
    </section>
  );
}
