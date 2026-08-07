export function ConversationSkeleton() {
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
