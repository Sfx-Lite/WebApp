import type { ChatMessage, Conversation, ConversationSummary } from "@/lib/types/chat";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export type SendMessagePayload = {
  message: string;
  conversationId?: string;
};

export type SendMessageResult = {
  conversationId: string;
  message: ChatMessage;
};

type ApiEnvelope<T> = {
  status: boolean;
  message: string;
  data: T;
};

export const chat = createApi({
  reducerPath: "chat",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Conversation", "ConversationList"],
  endpoints: builder => ({
    sendChatMessage: builder.mutation<SendMessageResult, SendMessagePayload>({
      query: payload => ({
        url: "/chat/message",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response: ApiEnvelope<SendMessageResult>) => response.data,
      invalidatesTags: result =>
        result
          ? [{ type: "Conversation", id: result.conversationId }, "ConversationList"]
          : ["ConversationList"],
    }),
    listConversations: builder.query<ConversationSummary[], void>({
      query: () => ({ url: "/chat/conversations", method: "GET" }),
      transformResponse: (response: ApiEnvelope<ConversationSummary[]>) => response.data,
      providesTags: ["ConversationList"],
    }),
    getConversation: builder.query<Conversation, string>({
      query: id => ({ url: `/chat/conversations/${id}`, method: "GET" }),
      transformResponse: (response: ApiEnvelope<Conversation>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Conversation", id }],
    }),
  }),
});

export const {
  useSendChatMessageMutation,
  useListConversationsQuery,
  useGetConversationQuery,
} = chat;
