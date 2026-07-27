import type { LucideIcon } from "lucide-react";
import type { Transaction } from "@/lib/types/transaction";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatTransactionTime, truncateAddress } from "@/utils/helper-funcs";

const STATUS_STYLES: Record<Transaction["status"], string> = {
  successful: "text-sfx-success bg-sfx-success-bg",
  processing: "text-sfx-amber bg-sfx-amber-bg",
  failed: "text-sfx-danger bg-sfx-danger-bg",
};

const STATUS_LABEL: Record<Transaction["status"], string> = {
  successful: "Successful",
  processing: "Processing",
  failed: "Failed",
};

const ICON_CONFIG: Record<"credit" | "debit", { icon: LucideIcon; iconBg: string; iconColor: string }> = {
  credit: { icon: ArrowDownLeft, iconBg: "bg-sfx-success-bg", iconColor: "text-sfx-success" },
  debit: { icon: ArrowUpRight, iconBg: "bg-sfx-primary-tint", iconColor: "text-sfx-primary" },
};

function getTitle(transaction: Transaction): string {
  if (transaction.counterpartyUsername)
    return transaction.counterpartyUsername;
  const typeFormatted = (transaction.type || "Unknown").split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  if (transaction.externalAddress)
    return `${typeFormatted} · ${truncateAddress(transaction.externalAddress)}`;
  return `${typeFormatted} · ${transaction.asset}`;
}

type Props = {
  transaction: Transaction;
  onClick?: () => void;
};

export default function TransactionItem({ transaction, onClick }: Props) {
  const { icon: Icon, iconBg, iconColor } = ICON_CONFIG[transaction.direction];
  const title = getTitle(transaction);
  const isCredit = transaction.direction === "credit";
  const amountDisplay = `${isCredit ? "+" : "-"}$${Number(transaction.amount).toFixed(2)}`;

  return (
    <li
      onClick={onClick}
      className="flex items-center justify-between p-card-pad rounded-card bg-sfx-card cursor-pointer hover:bg-sfx-muted/5 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`size-[45px] flex items-center justify-center p-[5px] rounded-[10px] ${iconBg}`}>
          <Icon className={`w-[25px] ${iconColor}`} />
        </div>
        <div className="flex flex-col">
          <span className="inline-block text-[15px] md:text-[16px] font-rh-sb">
            {title}
          </span>
          <span className="inline-flex items-center gap-0.5 text-sfx-muted">
            <span className="text-[13px] md:text-[15px]">
              {formatTransactionTime(transaction.createdAt)}
            </span>
            <span>
              ·
            </span>
            <span className={`text-[14px] font-rh-sb rounded-full py-[1px] px-2 ${STATUS_STYLES[transaction.status]}`}>
              {STATUS_LABEL[transaction.status]}
            </span>
          </span>
        </div>
      </div>

      <p className={`md:text-[20px] font-rh-sb ${isCredit ? "text-sfx-success" : ""}`}>
        {amountDisplay}
      </p>
    </li>
  );
}
