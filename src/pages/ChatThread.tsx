import type { ChatMessage } from "@/lib/types/chat";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import {
  useGetConversationQuery,
  useSendChatMessageMutation,
} from "@/api/chat";

const QUICK_ACTIONS = [
  "Card Creation",
  "Add money",
  "Send money",
  "Account Creation",
  "Report A Failed Transaction",
  "Account Issue/Request",
  "Cash deposit",
];

function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl bg-white px-4 py-3">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-sfx-muted/50 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 text-[15px] leading-[20px] ${
          isUser ? "bg-sfx-primary text-white" : "bg-white text-sfx-ink"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export default function ChatThread() {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId?: string }>();

  const { data: conversation, isLoading: isLoadingHistory } = useGetConversationQuery(
    conversationId ?? "",
    { skip: !conversationId },
  );

  const [sendChatMessage, { isLoading: isSending }] = useSendChatMessageMutation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasHydratedRef = useRef(false);

  // Hydrate local message list from server history once, when a
  // conversation's data first arrives.
  useEffect(() => {
    if (conversation && !hasHydratedRef.current) {
      setMessages(conversation.messages);
      hasHydratedRef.current = true;
    }
  }, [conversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending)
      return;

    const optimisticUserMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticUserMessage]);
    setInput("");

    try {
      const result = await sendChatMessage({
        message: trimmed,
        ...(activeConversationId ? { conversationId: activeConversationId } : {}),
      }).unwrap();

      if (!activeConversationId) {
        setActiveConversationId(result.conversationId);
        // Swap the URL to include the new conversation id without a full navigation,
        // so refreshing the page keeps working and history stays correct.
        navigate(`/support/chat/${result.conversationId}`, { replace: true });
      }

      // Defensive: only append the response as a new bubble if it's
      // actually the assistant speaking. If the endpoint really does
      // just echo the user's own message back (per the docs' literal
      // example), this silently no-ops instead of duplicating the
      // bubble already added optimistically above.
      if (result.message.role === "assistant") {
        setMessages(prev => [...prev, result.message]);
      }
    }
    catch {
      setMessages(prev => prev.filter(m => m.id !== optimisticUserMessage.id));
      setInput(trimmed);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const showEmptyGreeting = messages.length === 0 && !isLoadingHistory;

  return (
    <section className="flex flex-col h-screen">
      <div className="py-[14px] px-screen-x">
        <div className="w-full md:max-w-[50%] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-[10px] rounded-full bg-sfx-card"
            >
              <MdArrowBack className="text-[20px]" />
            </button>
            <span className="font-rh-b text-[18px]">SFx Assistant</span>
          </div>

          {/* No endpoint provided for human handoff — UI stub only. */}
          <button
            type="button"
            className="px-4 py-2 rounded-full bg-sfx-primary text-white text-[14px] font-rh-m"
          >
            Talk to agent
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-screen-x py-[20px]">
        <div className="w-full md:max-w-[50%] mx-auto space-y-4">
          {showEmptyGreeting && (
            <div className="rounded-2xl bg-white px-4 py-3 text-[15px] leading-[20px] text-sfx-ink max-w-[85%] md:max-w-[70%]">
              Hi 👋 I'm the SFx Money AI assistant, and I'm here to help you with questions about your account, transactions, balances, cards, and how to use the app. What can I help you with today?
            </div>
          )}

          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isSending && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      <div className="px-screen-x pb-[20px] pt-[10px] bg-sfx-bg">
        <div className="w-full md:max-w-[50%] mx-auto space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  className="px-4 py-2 rounded-full border border-sfx-primary/30 text-sfx-primary text-[14px] font-rh-m"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type message here…"
              className="flex-1 px-4 py-3 rounded-full bg-white font-rh-m text-[15px] outline-none focus:ring-2 focus:ring-sfx-primary/30"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="flex items-center justify-center size-[46px] rounded-full bg-sfx-primary text-white shrink-0 disabled:opacity-40"
            >
              <ArrowUp className="size-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
