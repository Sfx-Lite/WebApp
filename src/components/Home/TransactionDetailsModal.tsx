import type { Transaction } from "@/lib/types/transaction";
import { AlertCircle, ArrowDownLeft, ArrowUpRight, Check, CheckCircle2, Clock, Copy, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useGetTransactionByIdQuery } from "@/api/transactions";
import SvgSpinners3DotsFade from "@/components/global/icons/SvgSpinners3DotsFade";
import { formatTransactionTime, truncateHash } from "@/utils/helper-funcs";
import DefaultModal from "../global/Modals/DefaultModal";

type Props = {
  transactionId: string | null;
  onClose: () => void;
};

const STATUS_ICONS: Record<Transaction["status"], React.ReactNode> = {
  successful: <CheckCircle2 className="w-4 h-4" />,
  processing: <Clock className="w-4 h-4" />,
  failed: <AlertCircle className="w-4 h-4" />,
};

const STATUS_COLORS: Record<Transaction["status"], string> = {
  successful: "text-sfx-success bg-sfx-success-bg",
  processing: "text-sfx-amber bg-sfx-amber-bg",
  failed: "text-sfx-danger bg-sfx-danger-bg",
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-black/5 last:border-b-0">
      <span className="text-sfx-muted text-[13px] font-rh-m">{label}</span>
      <span className="text-sfx-ink text-[14px] font-rh-sb text-right">{value}</span>
    </div>
  );
}

function CopyField({ label, value, display }: { label: string; value: string; display: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(setCopied, 1500, false);
    }
    catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex-1 flex flex-col items-center gap-1.5 rounded-2xl bg-sfx-muted/5 border border-black/5 py-3 px-4 transition-colors hover:bg-sfx-muted/10 active:scale-[0.98]"
    >
      <p className="text-[11px] text-sfx-muted font-rh-m uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-1.5">
        <p className="text-[13px] text-sfx-ink font-mono">{display}</p>
        {copied
          ? <Check className="size-3.5 text-sfx-success shrink-0" />
          : <Copy className="size-3.5 text-sfx-muted shrink-0" />}
      </div>
    </button>
  );
}

export default function TransactionDetailsModal({ transactionId, onClose }: Props) {
  const { data: transaction, isLoading } = useGetTransactionByIdQuery(transactionId ?? "", {
    skip: !transactionId,
  });

  const isCredit = transaction?.direction === "credit";

  return (
    <DefaultModal isOpen={!!transactionId} onClose={onClose} showDragHandle>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-rh-b text-[17px] text-sfx-ink">Transaction Details</h3>
            <p className="mt-1 text-[13px] text-sfx-muted">View the full transaction summary and references.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close transaction details"
            className="flex items-center justify-center size-8 rounded-full bg-sfx-muted/10 text-sfx-muted hover:bg-sfx-muted/20 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-10 gap-3"
          >
            <SvgSpinners3DotsFade className="text-[2rem] text-sfx-primary" />
            <p className="text-sfx-muted text-sm font-rh-m">Fetching details...</p>
          </motion.div>
        )}

        {!isLoading && transaction && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(6px)", y: 8 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(6px)", y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center justify-center gap-3 pt-2">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isCredit ? "bg-sfx-success-bg text-sfx-success" : "bg-sfx-primary-tint text-sfx-primary"
                }`}
              >
                {isCredit ? <ArrowDownLeft size={28} /> : <ArrowUpRight size={28} />}
              </div>
              <h2 className={`text-4xl font-rh-b ${isCredit ? "text-sfx-success" : "text-sfx-ink"}`}>
                {isCredit ? "+" : "-"}
                $
                {Number(transaction.amount).toFixed(2)}
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-rh-sb uppercase tracking-wide ${STATUS_COLORS[transaction.status]}`}>
                {STATUS_ICONS[transaction.status]}
                {transaction.status}
              </span>
            </div>

            <div className="bg-sfx-muted/5 rounded-2xl px-5 border border-black/5">
              <DetailRow label="Date & Time" value={formatTransactionTime(transaction.createdAt)} />
              <DetailRow label="Transaction Type" value={<span className="capitalize">{transaction.type?.replace(/_/g, " ") ?? "Unknown"}</span>} />

              {transaction.asset && (
                <DetailRow label="Asset" value={transaction.asset} />
              )}

              {Number(transaction.fee) > 0 && (
                <DetailRow label="Fee" value={`$${Number(transaction.fee).toFixed(2)}`} />
              )}

              {transaction.counterpartyUsername && (
                <DetailRow label="Counterparty" value={`@${transaction.counterpartyUsername}`} />
              )}

              {transaction.externalAddress && (
                <DetailRow
                  label="External Address"
                  value={(
                    <span className="truncate max-w-45 block" title={transaction.externalAddress}>
                      {transaction.externalAddress}
                    </span>
                  )}
                />
              )}

              {transaction.note && (
                <div className="flex flex-col py-3 border-b border-black/5 last:border-b-0 gap-1">
                  <span className="text-sfx-muted text-[13px] font-rh-m">Note</span>
                  <span className="text-sfx-ink text-[14px] font-rh-sb">
                    {transaction.note}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <CopyField
                label="Transaction ID"
                value={transaction.id}
                display={truncateHash(transaction.id, 8, 6)}
              />
              {transaction.type !== "internal_transfer" && transaction.txHash && (
                <CopyField
                  label="Transaction Hash"
                  value={transaction.txHash}
                  display={truncateHash(transaction.txHash)}
                />
              )}
            </div>
          </motion.div>
        )}

        {!isLoading && !transaction && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-10 gap-3"
          >
            <AlertCircle className="w-10 h-10 text-sfx-danger" />
            <p className="text-sfx-muted text-[15px] font-rh-m">Transaction not found.</p>
          </motion.div>
        )}
      </div>
    </DefaultModal>
  );
}
