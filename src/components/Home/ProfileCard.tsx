import { Bell, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { useListNotificationsQuery } from "@/api/notifications";
import { useGetUserProfileQuery } from "@/api/users";

export default function ProfileCard() {
  const { data: user, isLoading } = useGetUserProfileQuery();
  const { data } = useListNotificationsQuery();
  const unreadCount = data?.unreadCount ?? 0;

  const navigate = useNavigate();

  const initial = user?.lastName?.charAt(0).toUpperCase() ?? "A";

  const isVerified = user?.kycStatus === "verified";

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-(--spacing-gutter)">
        <div className="user__gradient size-[2.5rem] rounded-full flex items-center justify-center">
          <span className="font-rh-b text-white">
            {initial}
          </span>
        </div>
        <div>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block">
              {isLoading ? "…" : `${user?.firstName} ${user?.lastName}`}
            </span>
            { isVerified && (
              <span className="inline-block">
                <Check className="w-[16px] text-sfx-success" />
              </span>
            )}
          </span>
          <div className="flex items-center">
            <span className="inline-block">
              {isLoading ? "…" : `@${user?.username}`}
            </span>
            {" "}
            <span className="inline-block">
              {isVerified ? "· verified " : "· not verified"}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/notifications")}
        className="relative flex items-center gap-2 p-[10px] rounded-full bg-sfx-card"
      >
        <Bell className="text-[14px] md:text-[18px] text-sfx-primary" />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-sfx-danger px-[3px] text-[10px] font-rh-b leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
