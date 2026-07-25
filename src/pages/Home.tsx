/* eslint-disable react/no-array-index-key */
import { Link } from "react-router";
import { useGetTransactionsQuery } from "@/api/transactions";
import TransactionEmptyState from "@/components/global/emptyStates/TransactionEmptyState";
import VerifyIdentity from "@/components/global/VerifyIdentity";
import TransactionItemSkeleton from "@/components/Home/loaders/TransactionItemSkeleton";
import TransactionItem from "@/components/Home/TransactionItem";
import WalletBalance from "@/components/Home/WalletBalance";

export default function Home() {
  const { data, isLoading } = useGetTransactionsQuery({ limit: 5, offset: 0 });
  const transactions = data?.items ?? [];

  // console.log(data);

  return (
    <section className="py-[25px] px-screen-x">
      <div className="space-y-[1.5rem]">
        <div className="flex gap-6">
          <WalletBalance />
        </div>

        <div className="p-card-pad bg-sfx-amber-bg rounded-card border-l-4 border-l-sfx-amber">
          <p className="text-sfx-amber">
            Testnet environment — balances are test USDC with no real-world value.
          </p>
        </div>

        <VerifyIdentity />

        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-block uppercase font-rh-sb text-sfx-muted tracking-wider">
              Recent transactions
            </span>

            <Link to="/" className="text-sfx-primary font-rh-sb">
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
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                  </ul>
                )}
        </div>
      </div>
    </section>
  );
}
