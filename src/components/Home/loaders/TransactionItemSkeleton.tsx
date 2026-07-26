export default function TransactionItemSkeleton() {
  return (
    <li className="flex items-center justify-between p-card-pad rounded-card bg-sfx-card animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-[45px] rounded-[10px] bg-sfx-muted/20" />
        <div className="flex flex-col gap-2">
          <div className="h-[16px] w-[120px] rounded-full bg-sfx-muted/20" />
          <div className="h-[13px] w-[150px] rounded-full bg-sfx-muted/20" />
        </div>
      </div>

      <div className="h-[18px] w-[60px] rounded-full bg-sfx-muted/20" />
    </li>
  );
}
