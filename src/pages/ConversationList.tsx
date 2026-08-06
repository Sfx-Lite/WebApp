/* eslint-disable react/no-array-index-key */
import { MessageCircle } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router";
import { useListConversationsQuery } from "@/api/chat";
import { formatRelativeTime } from "@/utils/helper-funcs";

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-(--spacing-card-pad) animate-pulse">
      <div className="size-11 rounded-full bg-sfx-primary-tint/40 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-[14px] w-[50%] rounded-full bg-sfx-primary-tint/40" />
        <div className="h-[13px] w-[70%] rounded-full bg-sfx-primary-tint/40" />
      </div>
    </div>
  );
}

export default function ConversationList() {
  const navigate = useNavigate();
  const { data, isLoading } = useListConversationsQuery();

  const conversations = data ?? [];

  return (
    <section className="py-[25px] px-screen-x">
      <div className="w-full md:max-w-[480px] mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="font-rh-b text-[18px]">Messages</span>
        </div>

        {isLoading
          ? (
              <div className="divide-y divide-sfx-muted/15 rounded-card bg-white shadow-brand overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ConversationSkeleton key={i} />
                ))}
              </div>
            )
          : conversations.length === 0
            ? (
                <div className="flex flex-col items-center justify-center gap-6 py-[2rem] text-center">
                  <p className="text-[15px] text-sfx-muted max-w-[260px]">
                    Messages from the team will appear here when you receive one.
                  </p>
                  <button
                    onClick={() => navigate("/support/chat")}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-brand font-rh-sb text-[15px] text-sfx-primary"
                  >
                    <MessageCircle className="size-4" />
                    Message us
                  </button>
                </div>
              )
            : (
                <div className="divide-y divide-sfx-muted/15 rounded-card bg-white shadow-brand overflow-hidden">
                  {conversations.map(conversation => (
                    <button
                      key={conversation.id}
                      onClick={() => navigate(`/support/chat/${conversation.id}`)}
                      className="w-full flex items-center gap-3 p-(--spacing-card-pad) text-left"
                    >
                      <div className="flex size-11 items-center justify-center rounded-full bg-sfx-primary-tint shrink-0">
                        <MessageCircle className="size-5 text-sfx-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-rh-b text-[15px] truncate">
                          {conversation.conversationTitle || "SFx Assistant"}
                        </p>
                      </div>
                      <span className="shrink-0 text-[13px] text-sfx-muted">
                        {formatRelativeTime(conversation.lastMessageAt)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
      </div>
    </section>
  );
}
