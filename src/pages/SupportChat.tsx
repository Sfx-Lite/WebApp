import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router";
import ChatEmptyState from "@/components/Chat/ChatEmptyState";

export default function SupportChat() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="space-y-[4rem]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <h1 className="font-rh-b text-[18px] text-sfx-ink">
            Messages
          </h1>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-6">
          <ChatEmptyState />
        </div>
      </div>
    </section>
  );
}
