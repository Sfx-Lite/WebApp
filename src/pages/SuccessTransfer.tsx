import type { TransferResult } from "@/api/transfer";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { resetSendMoney } from "@/store/sendMoneySlice";
import { trackEvent } from "@/utils/trackEvent";

type SuccessState = {
  result: TransferResult;
  recipientUsername: string;
};

export default function SuccessTransfer() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const state = location.state as SuccessState | null;

  useEffect(() => {
    if (state?.result) {
      trackEvent("send_completed", {
        amount: state.result.amount,
        transaction_id: state.result.transactionId,
      });
      dispatch(resetSendMoney());
    }
  }, [state?.result, dispatch]);

  if (!state?.result) {
    navigate("/");
    return null;
  }

  const { result, recipientUsername } = state;

  return (
    <section className="py-[25px] px-screen-x">
      <div className="w-full md:max-w-[50%] mx-auto space-y-6 text-center pt-[3rem]">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-sfx-success-bg">
          <Check className="size-8 text-sfx-success" />
        </div>

        <div className="space-y-1">
          <h2 className="font-rh-b text-[20px]">
            $
            {Number(result.amount).toFixed(2)}
            {" "}
            sent
          </h2>
          <p className="text-[14px] text-sfx-muted">
            {recipientUsername}
            {" "}
            has been credited instantly.
            <br />
            Ref
            {" "}
            {result.transactionId}
          </p>
        </div>

        <div className="p-(--spacing-card-pad) bg-sfx-card rounded-card divide-y divide-sfx-muted/15 text-left">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <span className="text-[14px] text-sfx-muted">To</span>
            <span className="font-rh-sb text-[15px]">
              @
              {recipientUsername}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[14px] text-sfx-muted">Fee</span>
            <span className="font-rh-sb text-[15px]">$0.00</span>
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
