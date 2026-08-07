import type { RootState } from "@/store";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useListNotificationsQuery } from "@/api/notifications";

export default function TopBar() {
  const title = useSelector((state: RootState) => state.topBar.title);
  const { data } = useListNotificationsQuery();
  const unreadCount = data?.unreadCount ?? 0;

  const navigate = useNavigate();

  return (
    <div className="py-[14px] md:px-screen-x bg-sfx-card">
      <div className="flex justify-between items-center gap-4">
        <h2 className="font-rh-b text-[20px]">
          { title }
          {" "}
          Home
        </h2>

        <button
          onClick={() => navigate("/notifications")}
          className="relative flex items-center gap-2"
        >
          <Bell className="text-[18px] text-sfx-primary" />
          {unreadCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-sfx-danger px-[3px] text-[10px] font-rh-b leading-none text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
