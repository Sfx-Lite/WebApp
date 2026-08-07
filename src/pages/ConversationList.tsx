/* eslint-disable react/no-array-index-key */
import { MessageCircle } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router";
import { useListConversationsQuery } from "@/api/chat";
import { ConversationSkeleton } from "@/components/Chat/ChatSkeleton";
import { formatRelativeTime } from "@/utils/helper-funcs";

export default function ConversationList() {
  const navigate = useNavigate();
  const { data, isLoading } = useListConversationsQuery();

  const conversations = data ?? [];
  const hasConversations = conversations.length > 0;

  return (
    <div className="flex flex-col h-full w-full bg-sfx-bg overflow-hidden">
      <div className="flex-shrink-0 px-4 md:px-6 pt-4 pb-3 md:py-4">
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center justify-center size-9 rounded-full bg-white shrink-0"
            aria-label="Go back"
          >
            <MdArrowBack className="text-[18px] text-sfx-ink" />
          </button>
          <span className="font-rh-b text-[16px] md:text-[17px] text-sfx-ink">Messages</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5">
        <div className="w-full max-w-2xl mx-auto space-y-4">
          {isLoading
            ? (
                <div className="divide-y divide-sfx-muted/15 rounded-card bg-white shadow-sm overflow-hidden">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ConversationSkeleton key={i} />
                  ))}
                </div>
              )
            : !hasConversations
                ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-[3rem] text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-sfx-primary-tint">
                        <MessageCircle className="size-8 text-sfx-primary" />
                      </div>
                      <p className="text-[15px] text-sfx-muted max-w-[260px]">
                        Messages from the team will appear here when you receive one.
                      </p>
                      <button
                        onClick={() => navigate("/support/chat")}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-sfx-primary text-white font-rh-sb text-[14px] md:text-[15px]"
                      >
                        <MessageCircle className="size-4" />
                        Message us
                      </button>
                    </div>
                  )
                : (
                    <>
                      <div className="divide-y divide-sfx-muted/15 rounded-card bg-white shadow-sm overflow-hidden">
                        {conversations.map(conversation => (
                          <button
                            key={conversation.id}
                            onClick={() => navigate(`/support/chat/${conversation.id}`)}
                            className="w-full flex items-center gap-3 p-4 md:p-[1rem] text-left hover:bg-sfx-muted/5 transition-colors"
                          >
                            <div className="flex size-10 md:size-11 items-center justify-center rounded-full bg-sfx-primary-tint shrink-0">
                              <MessageCircle className="size-5 text-sfx-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-rh-b text-[14px] md:text-[15px] text-sfx-ink truncate">
                                {conversation.conversationTitle || "SFx Assistant"}
                              </p>
                              <p className="text-[13px] text-sfx-muted truncate">
                                Last message received
                              </p>
                            </div>
                            <span className="shrink-0 text-[12px] md:text-[13px] text-sfx-muted">
                              {formatRelativeTime(conversation.lastMessageAt)}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-center pt-4">
                        <button
                          onClick={() => navigate("/support/chat")}
                          className="w-fit flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-sfx-primary text-white font-rh-sb text-[14px] md:text-[15px]"
                        >
                          <MessageCircle className="size-5" />
                          New conversation
                        </button>
                      </div>
                    </>
                  )}
        </div>
      </div>
    </div>
  );
}
