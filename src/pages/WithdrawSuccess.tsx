import type { WithdrawalResult } from "@/lib/types/withdrawal";
import { Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { truncateAddress } from "@/utils/helper-funcs";

type SuccessState = {
  result: WithdrawalResult;
};

export default function WithdrawSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SuccessState | null;

  if (!state?.result) {
    navigate("/");
    return null;
  }

  const { result } = state;
  const isProcessing = result.status === "processing";

  return (
    <section className="py-[25px] md:px-screen-x">
      <div className="w-full md:max-w-[50%] mx-auto space-y-6 text-center pt-[3rem]">
        <div className={`mx-auto flex size-16 items-center justify-center rounded-full ${
          isProcessing ? "bg-sfx-amber-bg" : "bg-sfx-success-bg"
        }`}
        >
          <Check className={`size-8 ${isProcessing ? "text-sfx-amber" : "text-sfx-success"}`} />
        </div>

        <div className="space-y-1">
          <h2 className="font-rh-b text-[20px]">
            $
            {Number(result.amount).toFixed(2)}
            {" "}
            {isProcessing ? "processing" : "sent"}
          </h2>
          <p className="text-[14px] text-sfx-muted">
            {isProcessing
              ? "Your withdrawal is broadcasting to the network. This usually takes a minute."
              : "Your withdrawal has been confirmed."}
          </p>
        </div>

        <div className="p-(--spacing-card-pad) bg-sfx-card rounded-card divide-y divide-sfx-muted/15 text-left">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <span className="text-[14px] text-sfx-muted">To</span>
            <span className="font-rh-sb text-[15px] font-mono">
              {truncateAddress(result.externalAddress, 8, 6)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[14px] text-sfx-muted">Fee</span>
            <span className="font-rh-sb text-[15px]">
              $
              {Number(result.fee).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[14px] text-sfx-muted">Total</span>
            <span className="font-rh-sb text-[15px]">
              $
              {Number(result.total).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 last:pb-0">
            <span className="text-[14px] text-sfx-muted">New balance</span>
            <span className="font-rh-sb text-[15px]">
              $
              {Number(result.balanceAfter).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/transactions/${result.transactionId}`)}
            className="flex-1 py-4 rounded-button border border-sfx-primary text-sfx-primary font-rh-m text-[15px]"
          >
            View receipt
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-4 rounded-button bg-sfx-primary text-white font-rh-m text-[15px]"
          >
            Done
          </button>
        </div>
      </div>
    </section>
  );
}
