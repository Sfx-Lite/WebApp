export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  createdAt: string;
  role: ChatRole;
  content: string;
};

export type ConversationSummary = {
  id: string;
  createdAt: string;
  conversationTitle: string;
  lastMessageAt: string;
};

export type Conversation = {
  id: string;
  createdAt: string;
  conversationTitle: string;
  messages: ChatMessage[];
};
