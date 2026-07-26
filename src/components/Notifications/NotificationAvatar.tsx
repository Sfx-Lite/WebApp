import { PiCoinVerticalDuotone } from "react-icons/pi";

export default function NotificationAvatar({ unread }: { unread: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className="flex size-10 items-center justify-center rounded-full bg-sfx-primary-tint">
        <PiCoinVerticalDuotone className="size-5 text-sfx-primary-strong" />
      </div>
      {unread && (
        <span className="absolute -right-0.5 top-0 size-2.5 rounded-full bg-sfx-danger ring-2 ring-white" />
      )}
    </div>
  );
}
