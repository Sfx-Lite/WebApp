/* eslint-disable react/no-array-index-key */
import type { RootState } from "@/store";
import { Delete } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useVerifyPinMutation } from "@/api/auth";
import { useCalculateFeeQuery } from "@/api/fee";
import { useTransferToUserMutation } from "@/api/transactions";
import { trackEvent } from "@/utils/trackEvent";

const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"] as const;
const MAX_ATTEMPTS = 5;

export default function ReviewTransfer() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.sendMoney);
  const [verifyPin, { isLoading: isVerifying }] = useVerifyPinMutation();
  const [transfer, { isLoading: isTransferring }] = useTransferToUserMutation();

  const [isPinOpen, setIsPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const isBusy = isVerifying || isTransferring;

  const amountNumber = Number(draft.amount || 0);

  const { data: feeData, isFetching: isFeeLoading } = useCalculateFeeQuery(
    { amount: amountNumber, from: "USD", to: "USD" },
    { skip: amountNumber <= 0 },
  );

  useEffect(() => {
    if (!draft.recipientUsername || !draft.amount) {
      navigate("/sendmoney/sfxs", { replace: true });
    }

    else {
      trackEvent("send_review_started", { amount: draft.amount });
    }
  }, [draft.recipientUsername, draft.amount, navigate]);

  if (!draft.recipientUsername || !draft.amount) {
    return null;
  }

  const fee = feeData?.fee ?? 0;
  const total = amountNumber + fee;

  const handlePinKey = async (key: string) => {
    if (isLockedOut)
      return;

    if (key === "back") {
      setPin(prev => prev.slice(0, -1));
      return;
    }
    if (!key || pin.length >= PIN_LENGTH)
      return;

    const nextPin = pin + key;
    setPin(nextPin);

    if (nextPin.length === PIN_LENGTH) {
      setError(null);

      try {
        const verifyResult = await verifyPin(nextPin).unwrap();

        if (!verifyResult.verified) {
          throw new Error("PIN not verified");
        }

        const result = await transfer({
          recipientUsername: draft.recipientUsername!,
          amount: draft.amount,
          note: draft.note || undefined,
        }).unwrap();

        navigate("/sendmoney/sfxs/success", {
          state: { result, recipientUsername: draft.recipientUsername },
        });
      }
      catch (err: any) {
        setPin("");

        if (err?.status === 401) {
          const attemptsSoFar = failedAttempts + 1;
          setFailedAttempts(attemptsSoFar);

          if (attemptsSoFar >= MAX_ATTEMPTS) {
            setIsLockedOut(true);
            setError("Too many incorrect attempts. Try again in 15 minutes.");
          }
          else {
            const remaining = MAX_ATTEMPTS - attemptsSoFar;
            setError(`Incorrect PIN. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`);
          }
        }
        else if (err?.status === 403) {
          setError("You need to complete identity verification before sending.");
        }
        else {
          setError("Transfer failed. Please try again.");
        }
      }
    }
  };

  return (
    <section className="py-[25px] px-screen-x relative">
      <div className="space-y-[2rem]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/sendmoney/sfxs/amount")}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="inline-block font-rh-m">
            Review transfer
          </span>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-6">
          <div className="p-(--spacing-card-pad) bg-sfx-card rounded-card divide-y divide-sfx-muted/15">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <span className="text-[14px] text-sfx-muted">To</span>
              <span className="font-rh-sb text-[15px]">
                {draft.recipientDisplayName}
                {" "}
                ·
                {" "}
                @
                {draft.recipientUsername}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[14px] text-sfx-muted">Amount</span>
              <span className="font-rh-sb text-[15px]">
                $
                {amountNumber.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[14px] text-sfx-muted">Fee</span>
              <span className="font-rh-sb text-[15px]">
                { isFeeLoading ? "..." : `$${fee.toFixed(2)}` }
              </span>
            </div>
            <div className="flex items-center justify-between py-3 last:pb-0">
              <span className="text-[14px] text-sfx-muted">Total</span>
              <span className="font-rh-sb text-[15px]">
                $
                { isFeeLoading ? "..." : `${total.toFixed(2)}` }
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto">
          <button
            onClick={() => setIsPinOpen(true)}
            className="w-full py-4 rounded-button bg-sfx-primary text-white font-rh-m text-[15px]"
          >
            Confirm and send
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isPinOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => !isBusy && setIsPinOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2rem] p-[2rem] space-y-6"
            >
              <div className="mx-auto h-1 w-10 rounded-full bg-sfx-muted/30" />

              <div className="text-center space-y-1">
                <h3 className="font-rh-b text-[18px]">Enter your PIN</h3>
                <p className="text-[14px] text-sfx-muted">
                  Confirm sending $
                  {amountNumber.toFixed(2)}
                  {" "}
                  to @
                  {draft.recipientUsername}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                  <span
                    key={i}
                    className={`size-3 rounded-full ${i < pin.length ? "bg-sfx-primary" : "bg-sfx-muted/25"}`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-center text-[14px] text-sfx-danger">{error}</p>
              )}

              <div className="grid grid-cols-3 gap-y-6 max-w-[280px] mx-auto">
                {KEYS.map((key, i) => (
                  <button
                    key={i}
                    disabled={isBusy || isLockedOut || !key}
                    onClick={() => handlePinKey(key)}
                    className="flex items-center justify-center text-[24px] font-rh-m py-2 disabled:opacity-0"
                  >
                    {key === "back" ? <Delete className="size-5" /> : key}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
