import type { PaginatedNotifications } from "@/lib/types/notifications";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

type NotificationsEnvelope = {
  status: boolean;
  message: string;
  data: PaginatedNotifications;
};

type ListParams = {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
} | void;

export const notifications = createApi({
  reducerPath: "notifications",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Notification"],
  endpoints: builder => ({
    listNotifications: builder.query<PaginatedNotifications, ListParams>({
      query: params => ({
        url: "/notifications",
        method: "GET",
        params: params ?? { limit: 20, offset: 0 },
      }),
      transformResponse: (response: NotificationsEnvelope) => response.data,
      providesTags: result =>
        result
          ? [
              ...result.items.map(item => ({ type: "Notification" as const, id: item.id })),
              { type: "Notification" as const, id: "LIST" },
            ]
          : [{ type: "Notification" as const, id: "LIST" }],
    }),
    markNotificationRead: builder.mutation<void, string>({
      query: id => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notifications.util.updateQueryData("listNotifications", undefined, (draft) => {
            const target = draft.items.find(item => item.id === id);
            if (target && !target.readAt) {
              target.readAt = new Date().toISOString();
              draft.unreadCount = Math.max(0, draft.unreadCount - 1);
            }
          }),
        );
        try {
          await queryFulfilled;
        }
        catch {
          patchResult.undo();
        }
      },
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: "/notifications/read-all", method: "PATCH" }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notifications;
