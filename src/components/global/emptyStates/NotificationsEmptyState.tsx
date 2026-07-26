export default function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-(--spacing-card-pad) animate-pulse">
      <div className="size-10 rounded-full bg-sfx-primary-tint/40 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-[15px] w-[60%] rounded-full bg-sfx-primary-tint/40" />
        <div className="h-[14px] w-[85%] rounded-full bg-sfx-primary-tint/40" />
      </div>
    </div>
  );
}
