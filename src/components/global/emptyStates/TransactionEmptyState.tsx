import { Wallet } from "lucide-react";

export default function TransactionEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-[3rem] gap-3">
      <div className="flex items-center justify-center rounded-full bg-sfx-primary-bg">
        <Wallet className="text-[50px] text-sfx-primary" />
      </div>
      <div className="flex flex-col items-center">
        <p className="font-rh-sb text-[16px]">
          No transactions
        </p>
        <p className="text-sfx-muted text-[14px]">
          You have no transactions yet
        </p>
      </div>
    </div>
  );
}
