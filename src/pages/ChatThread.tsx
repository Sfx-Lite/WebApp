import type { ChatMessage } from "@/lib/types/chat";
import { ArrowUp, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import {
  useGetConversationQuery,
  useSendChatMessageMutation,
} from "@/api/chat";

const QUICK_ACTIONS = ["What are the fees?", "Is my money safe?"];

function AssistantAvatar() {
  return (
    <div className="flex items-center justify-center size-9 rounded-full bg-sfx-primary shrink-0">
      <MessageCircle className="size-4.5 text-white" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl bg-white px-4 py-3 w-fit">
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

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] md:max-w-[70%] rounded-3xl bg-sfx-primary px-4 py-3 text-[15px] leading-[20px] text-white">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] md:max-w-[70%] rounded-3xl bg-white px-4 py-3 text-[15px] leading-[20px] text-sfx-ink space-y-2">
        <p>{message.content}</p>
        {"source" in message && (message as any).source && (
          <p className="pt-1.5 border-t border-sfx-muted/15 text-[12px] text-sfx-muted">
            Source:
            {" "}
            {(message as any).source}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyGreeting() {
  return (
    <div className="max-w-[85%] md:max-w-[70%] rounded-3xl bg-white px-4 py-3 text-[15px] leading-[20px] text-sfx-ink">
      Hi 👋 I'm the SFx Lite assistant. Ask me anything about adding money, sending, fees or security.
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
        navigate(`/support/chat/${result.conversationId}`, { replace: true });
      }

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
    <div className="flex flex-col h-full w-full bg-sfx-bg overflow-hidden">
      <div className="flex-shrink-0 px-4 md:px-6 pt-4 pb-3 md:py-4">
        <div className="w-full max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/support")}
            className="flex items-center justify-center size-9 rounded-full bg-white shrink-0"
            aria-label="Go back"
          >
            <MdArrowBack className="text-[18px] text-sfx-ink" />
          </button>

          <AssistantAvatar />

          <div className="flex flex-col">
            <span className="font-rh-b text-[15px] md:text-[16px] text-sfx-ink">SFx Lite Assistant</span>
            <span className="text-[12px] md:text-[13px] text-sfx-success font-rh-m flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-sfx-success" />
              Online · answers in seconds
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-2">
        <div className="w-full max-w-2xl mx-auto space-y-4">
          {showEmptyGreeting && <EmptyGreeting />}

          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isSending && <TypingIndicator />}

          <div ref={scrollRef} />
        </div>
      </div>

      <div className="flex-shrink-0 px-4 md:px-6 pt-2 pb-4 md:pb-5">
        <div className="w-full max-w-2xl mx-auto space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action}
                  type="button"
                  onClick={() => sendMessage(action)}
                  className="px-4 py-2 rounded-full border border-sfx-primary/30 bg-white text-sfx-primary text-[14px] font-rh-m"
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
              placeholder="Ask a question…"
              className="flex-1 min-w-0 px-4 py-3 rounded-full bg-white font-rh-m text-[15px] outline-none focus:ring-2 focus:ring-sfx-primary/30 text-sfx-ink placeholder:text-sfx-muted"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="flex items-center justify-center size-11 rounded-full bg-sfx-primary text-white shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowUp className="size-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
