/* eslint-disable react/no-array-index-key */
import { MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useGetTransactionsQuery } from "@/api/transactions";
import TransactionEmptyState from "@/components/global/emptyStates/TransactionEmptyState";
import VerifyIdentity from "@/components/global/VerifyIdentity";
import TransactionItemSkeleton from "@/components/Home/loaders/TransactionItemSkeleton";
import ProfileCard from "@/components/Home/ProfileCard";
import TransactionDetailsModal from "@/components/Home/TransactionDetailsModal";
import TransactionItem from "@/components/Home/TransactionItem";
import WalletBalance from "@/components/Home/WalletBalance";

export default function Home() {
  const { data, isLoading } = useGetTransactionsQuery({ limit: 5, offset: 0 });
  const transactions = data?.items ?? [];
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  // console.log(data);

  return (
    <section className="md:px-screen-x">
      <div className="block md:hidden mt-2 mb-4">
        <ProfileCard />
      </div>
      <div className="relative space-y-[1.25rem] md:space-y-[1.5rem]">
        <div className="flex gap-6">
          <WalletBalance />
        </div>

        <div className="p-card-pad bg-sfx-amber-bg rounded-card border-l-4 border-l-sfx-amber">
          <p className="text-sfx-amber text-[14px] md:text-[16px]">
            Testnet environment — balances are test USDC with no real-world value.
          </p>
        </div>

        <VerifyIdentity />

        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-block uppercase text-[15px] md:text-[16px] font-rh-sb text-sfx-muted tracking-wider">
              Recent transactions
            </span>

            <Link to="/" className="text-sfx-primary text-[15px] md:text-[16px] font-rh-sb">
              See all
            </Link>
          </div>

          {isLoading
            ? (
                <ul className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <TransactionItemSkeleton key={i} />
                  ))}
                </ul>
              )
            : transactions.length === 0
              ? (
                  <TransactionEmptyState />
                )
              : (
                  <ul className="space-y-3">
                    {transactions.map(transaction => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onClick={() => setSelectedTxId(transaction.id)}
                      />
                    ))}
                  </ul>
                )}
        </div>

        <Link
          to="/support"
          className="fixed bottom-15 right-15 p-[1rem] bg-sfx-primary rounded-full"
        >
          <MessageCircleIcon className="text-[2rem] text-white" />
        </Link>
      </div>

      <TransactionDetailsModal
        transactionId={selectedTxId}
        onClose={() => setSelectedTxId(null)}
      />
    </section>
  );
}
