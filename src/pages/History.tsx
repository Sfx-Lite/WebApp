/* eslint-disable react/no-array-index-key */
import type { Transaction, TransactionStatus, TransactionType } from "@/lib/types/transaction";
import { useMemo, useState } from "react";
import { useGetTransactionsQuery } from "@/api/transactions";
import { useGetWalletBalanceQuery } from "@/api/wallet";
import TransactionEmptyState from "@/components/global/emptyStates/TransactionEmptyState";
import FilterDropdown from "@/components/History/FilterDropDown";
import HistoryTransactionRow from "@/components/History/HistoryTransactionRow";
import TransactionItemSkeleton from "@/components/Home/loaders/TransactionItemSkeleton";
import TransactionDetailsModal from "@/components/Home/TransactionDetailsModal";
import { formatMonthLabel } from "@/utils/helper-funcs";

type CategoryFilter = TransactionType | "all";
type StatusFilter = TransactionStatus | "all";

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All categories" },
  { value: "deposit", label: "Deposits" },
  { value: "send", label: "Sent" },
  { value: "withdrawal", label: "Withdrawals" },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All status" },
  { value: "successful", label: "Successful" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
];

function monthKey(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
}

export default function History() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  const { data, isLoading } = useGetTransactionsQuery({ limit: 20, offset: 0 });
  const { data: walletBalance } = useGetWalletBalanceQuery();

  // console.log(data)

  // eslint-disable-next-line react/exhaustive-deps
  const allTransactions = data?.items ?? [];

  const filtered = useMemo(() => {
    return allTransactions.filter((tx) => {
      if (category !== "all" && tx.type !== category)
        return false;
      if (status !== "all" && tx.status !== status)
        return false;
      return true;
    });
  }, [allTransactions, category, status]);

  const balanceByTransactionId = useMemo(() => {
    const map = new Map<string, number>();
    if (!walletBalance)
      return map;

    let runningBalance = Number(walletBalance.balance);
    for (const tx of allTransactions) {
      map.set(tx.id, runningBalance);
      const amount = Number(tx.amount);
      runningBalance = tx.direction === "credit" ? runningBalance - amount : runningBalance + amount;
    }
    return map;
  }, [allTransactions, walletBalance]);

  const showBalanceColumn = category === "all" && status === "all";

  const grouped = useMemo(() => {
    const groups = new Map<string, { label: string; items: Transaction[] }>();
    for (const tx of filtered) {
      const key = monthKey(tx.createdAt);
      if (!groups.has(key)) {
        groups.set(key, { label: formatMonthLabel(tx.createdAt), items: [] });
      }
      groups.get(key)!.items.push(tx);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [filtered]);

  const monthSummary = (items: Transaction[]) => {
    const sent = items
      .filter(tx => tx.direction === "debit")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    const received = items
      .filter(tx => tx.direction === "credit")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    return { sent, received };
  };

  return (
    <section>
      <div className="w-full md:max-w-[50%] mx-auto space-y-[1.5rem]">
        <h1 className="font-rh-b text-[22px]">History</h1>

        <div className="flex items-center gap-3">
          <FilterDropdown
            label="All categories"
            value={category}
            options={CATEGORY_OPTIONS}
            onChange={setCategory}
            variant="filled"
          />
          <FilterDropdown
            label="All status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={setStatus}
            variant="outline"
          />
        </div>

        {isLoading
          ? (
              <ul className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <TransactionItemSkeleton key={i} />
                ))}
              </ul>
            )
          : filtered.length === 0
            ? (
                <TransactionEmptyState />
              )
            : (
                <div className="space-y-6">
                  {grouped.map(([key, group]) => {
                    const { sent, received } = monthSummary(group.items);
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[13px] font-rh-sb text-sfx-muted tracking-wider">
                            {group.label}
                          </span>
                          <span className="text-[13px] text-sfx-muted">
                            Sent $
                            {sent.toFixed(2)}
                            {" "}
                            · Received $
                            {received.toFixed(2)}
                          </span>
                        </div>

                        <ul className="space-y-3">
                          {group.items.map((tx, index) => (
                            <HistoryTransactionRow
                              key={tx.id}
                              transaction={tx}
                              index={index}
                              balanceAfter={showBalanceColumn ? balanceByTransactionId.get(tx.id) : undefined}
                              onClick={() => setSelectedTxId(tx.id)}
                            />
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
      </div>

      <TransactionDetailsModal
        transactionId={selectedTxId}
        onClose={() => setSelectedTxId(null)}
      />
    </section>
  );
}
