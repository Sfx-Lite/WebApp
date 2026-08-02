import { MessageCircleMore } from "lucide-react";

export default function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p className="text-center text-sfx-muted">
        Messages from the team will appear
        {" "}
        <br />
        {" "}
        here when you receive one.
      </p>

      <button className="flex items-center gap-2 rounded-full py-3 px-6 bg-sfx-card">
        <MessageCircleMore size={22} className="text-sfx-primary" />
        <span className="font-rh-b text-sfx-primary">
          Message us
        </span>
      </button>
    </div>
  );
}
