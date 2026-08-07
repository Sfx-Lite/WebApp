import type { Transaction } from "@/lib/types/transaction";
import { AlertCircle, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { useGetTransactionByIdQuery } from "@/api/transactions";
import SvgSpinners3DotsFade from "@/components/global/icons/SvgSpinners3DotsFade";
import { BottomSheet } from "@/components/ui/bottomSheet";
import { formatTransactionTime } from "@/utils/helper-funcs";

type Props = {
  transactionId: string | null;
  onClose: () => void;
};

const STATUS_ICONS: Record<Transaction["status"], React.ReactNode> = {
  successful: <CheckCircle2 className="w-5 h-5 text-sfx-success" />,
  processing: <Clock className="w-5 h-5 text-sfx-amber" />,
  failed: <AlertCircle className="w-5 h-5 text-sfx-danger" />,
};

const STATUS_COLORS: Record<Transaction["status"], string> = {
  successful: "text-sfx-success bg-sfx-success-bg",
  processing: "text-sfx-amber bg-sfx-amber-bg",
  failed: "text-sfx-danger bg-sfx-danger-bg",
};

export default function TransactionDetailsModal({ transactionId, onClose }: Props) {
  const { data: transaction, isLoading } = useGetTransactionByIdQuery(transactionId ?? "", {
    skip: !transactionId,
  });

  const isCredit = transaction?.direction === "credit";

  return (
    <BottomSheet
      open={!!transactionId}
      onOpenChange={(open) => {
        if (!open)
          onClose();
      }}
      title="Transaction Details"
    >
      <div className="py-6 px-2 space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <SvgSpinners3DotsFade className="text-[2rem] text-sfx-primary" />
            <p className="text-sfx-muted text-sm font-rh-m">Fetching details...</p>
          </div>
        )}

        {!isLoading && transaction && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Amount & Type Header */}
            <div className="flex flex-col items-center justify-center space-y-2 mb-8">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${
                  isCredit ? "bg-sfx-success-bg text-sfx-success" : "bg-sfx-primary-tint text-sfx-primary"
                }`}
              >
                {isCredit ? <ArrowDownLeft size={30} /> : <ArrowUpRight size={30} />}
              </div>
              <h2 className={`text-4xl font-rh-b ${isCredit ? "text-sfx-success" : "text-sfx-ink"}`}>
                {isCredit ? "+" : "-"}
                $
                {Number(transaction.amount).toFixed(2)}
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-rh-sb uppercase tracking-wide ${STATUS_COLORS[transaction.status]}`}>
                {STATUS_ICONS[transaction.status]}
                {transaction.status}
              </span>
            </div>

            {/* Details Card */}
            <div className="bg-sfx-muted/5 rounded-2xl p-5 space-y-4 shadow-sm border border-black/5">
              <div className="flex items-center justify-between py-2 border-b border-black/5">
                <span className="text-sfx-muted text-[14px] font-rh-m">Date & Time</span>
                <span className="text-sfx-ink text-[14px] font-rh-sb">
                  {formatTransactionTime(transaction.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-black/5">
                <span className="text-sfx-muted text-[14px] font-rh-m">Transaction Type</span>
                <span className="text-sfx-ink text-[14px] font-rh-sb capitalize">
                  {transaction.type?.replace(/_/g, " ") ?? "Unknown"}
                </span>
              </div>

              {transaction.asset && (
                <div className="flex items-center justify-between py-2 border-b border-black/5">
                  <span className="text-sfx-muted text-[14px] font-rh-m">Asset</span>
                  <span className="text-sfx-ink text-[14px] font-rh-sb">
                    {transaction.asset}
                  </span>
                </div>
              )}

              {Number(transaction.fee) > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-black/5">
                  <span className="text-sfx-muted text-[14px] font-rh-m">Fee</span>
                  <span className="text-sfx-ink text-[14px] font-rh-sb">
                    $
                    {Number(transaction.fee).toFixed(2)}
                  </span>
                </div>
              )}

              {transaction.counterpartyUsername && (
                <div className="flex items-center justify-between py-2 border-b border-black/5">
                  <span className="text-sfx-muted text-[14px] font-rh-m">Counterparty</span>
                  <span className="text-sfx-ink text-[14px] font-rh-sb">
                    @
                    {transaction.counterpartyUsername}
                  </span>
                </div>
              )}

              {transaction.externalAddress && (
                <div className="flex items-center justify-between py-2 border-b border-black/5">
                  <span className="text-sfx-muted text-[14px] font-rh-m">External Address</span>
                  <span className="text-sfx-ink text-[14px] font-rh-sb truncate max-w-45" title={transaction.externalAddress}>
                    {transaction.externalAddress}
                  </span>
                </div>
              )}

              {transaction.note && (
                <div className="flex flex-col py-2 border-b border-black/5 space-y-1">
                  <span className="text-sfx-muted text-[14px] font-rh-m">Note</span>
                  <span className="text-sfx-ink text-[14px] font-rh-sb">
                    {transaction.note}
                  </span>
                </div>
              )}
            </div>

            {/* ID & Reference */}
            <div className="flex gap-8 justify-center">
              <div className="mt-6 flex flex-col items-center justify-center space-y-1">
                <p className="text-[12px] text-sfx-muted font-rh-m uppercase tracking-widest">Transaction ID</p>
                <p className="text-[13px] text-sfx-ink/70 font-mono bg-sfx-muted/10 px-3 py-1 rounded-md">
                  {transaction.id}
                </p>
              </div>
              <div className="mt-6 flex flex-col items-center justify-center space-y-1">
                <p className="text-[12px] text-sfx-muted font-rh-m uppercase tracking-widest">Transaction Hash</p>
                <p className="text-[13px] text-sfx-ink/70 font-mono bg-sfx-muted/10 px-3 py-1 rounded-md">
                  {transaction.txHash}
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !transaction && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <AlertCircle className="w-10 h-10 text-sfx-danger" />
            <p className="text-sfx-muted text-[15px] font-rh-m">Transaction not found.</p>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
