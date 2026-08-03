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

const ICON_CONFIG: Record<Transaction["type"], { icon: LucideIcon; iconBg: string; iconColor: string }> = {
  deposit: { icon: ArrowDownLeft, iconBg: "bg-sfx-success-bg", iconColor: "text-sfx-success" },
  send: { icon: ArrowUpRight, iconBg: "bg-sfx-primary-bg", iconColor: "text-sfx-primary" },
  withdrawal: { icon: ArrowUpRight, iconBg: "bg-sfx-amber-bg", iconColor: "text-sfx-amber" },
};

function getTitle(transaction: Transaction) {
  switch (transaction.type) {
    case "deposit":
      return `Deposit · ${transaction.asset}`;
    case "send":
      return transaction.counterpartyUsername ?? `Send · ${transaction.asset}`;
    case "withdrawal":
      return transaction.externalAddress
        ? `Withdrawal · ${truncateAddress(transaction.externalAddress)}`
        : `Withdrawal · ${transaction.asset}`;
  }
}

type Props = {
  transaction: Transaction;
  balanceAfter?: number;
};

export default function TransactionItem({ transaction, balanceAfter }: Props) {
  const { icon: Icon, iconBg, iconColor } = ICON_CONFIG[transaction.type];
  const title = getTitle(transaction);
  const isCredit = transaction.direction === "credit";
  const amountDisplay = `${isCredit ? "+" : "−"}$${Number(transaction.amount).toFixed(2)}`;

  return (
    <li className="flex items-center justify-between p-card-pad rounded-card bg-sfx-card">
      <div className="flex items-center gap-3">
        <div className={`size-[45px] flex items-center justify-center p-[5px] rounded-[10px] ${iconBg}`}>
          <Icon className={`w-[25px] ${iconColor}`} />
        </div>
        <div className="flex flex-col">
          <span className="inline-block font-rh-sb">
            {title}
          </span>
          <span className="inline-flex items-center gap-0.5 text-sfx-muted">
            <span className="text-[15px]">
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

      <div className="flex flex-col items-end gap-0.5">
        <p className={`text-[20px] font-rh-sb ${isCredit ? "text-sfx-success" : ""}`}>
          {amountDisplay}
        </p>
        {balanceAfter !== undefined && (
          <p className="text-[13px] text-sfx-muted">
            $
            {balanceAfter.toFixed(2)}
          </p>
        )}
      </div>
    </li>
  );
}
