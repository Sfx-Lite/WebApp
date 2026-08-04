/* eslint-disable react/no-array-index-key */
import type { RootState } from "@/store";
import { Delete } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useCalculateFeeQuery } from "@/api/fee";
import { useWithdrawMutation } from "@/api/withdrawal";
// import { resetWithdraw } from "@/store/withdrawSlice";
import { truncateAddress } from "@/utils/helper-funcs";

const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"] as const;

export default function WithdrawReview() {
  const navigate = useNavigate();
  //   const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.withdraw);
  const [withdraw, { isLoading }] = useWithdrawMutation();

  const [isPinOpen, setIsPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const amountNumber = Number(draft.amount || 0);

  const { data: feeData, isFetching: isFeeLoading } = useCalculateFeeQuery(
    { amount: amountNumber, from: "USD", to: "USD" },
    { skip: amountNumber <= 0 },
  );

  useEffect(() => {
    if (!draft.externalAddress || !draft.amount) {
      navigate("/withdraw/address");
    }
  }, [draft.externalAddress, draft.amount, navigate]);

  if (!draft.externalAddress || !draft.amount) {
    return null;
  }

  const fee = feeData?.fee ?? 0;
  const total = amountNumber + fee;

  const handlePinKey = async (key: string) => {
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
        const result = await withdraw({
          amount: draft.amount,
          externalAddress: draft.externalAddress!,
          pin: nextPin,
          note: draft.note || undefined,
        }).unwrap();

        navigate("/withdraw/success", { state: { result } });
        // dispatch(resetWithdraw());
      }
      catch (err: any) {
        setPin("");

        if (err?.status === 403) {
          setError(err?.data?.message ?? "Unable to authorize this withdrawal. Check your PIN or verification status.");
        }
        else if (err?.status === 422) {
          setError("Insufficient balance to cover the amount plus fee.");
        }
        else {
          setError("Withdrawal failed. Please try again.");
        }
      }
    }
  };

  return (
    <section className="py-[25px] px-screen-x relative">
      <div className="space-y-[2rem]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/withdraw/amount")}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="inline-block font-rh-m">
            Review withdrawal
          </span>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-6">
          <div className="p-(--spacing-card-pad) bg-sfx-card rounded-card divide-y divide-sfx-muted/15">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <span className="text-[14px] text-sfx-muted">To</span>
              <span className="font-rh-sb text-[15px] font-mono">
                {truncateAddress(draft.externalAddress, 8, 6)}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[14px] text-sfx-muted">Network</span>
              <span className="font-rh-sb text-[15px]">Polygon Amoy</span>
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
                {isFeeLoading ? "…" : `$${fee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 last:pb-0">
              <span className="text-[14px] text-sfx-muted">Total</span>
              <span className="font-rh-sb text-[15px]">
                {isFeeLoading ? "…" : `$${total.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="p-(--spacing-card-pad) rounded-card border border-sfx-danger/30 bg-sfx-danger-bg">
            <p className="text-[13px] leading-[18px] text-sfx-danger">
              This transaction is irreversible once broadcast. Double-check the address before confirming.
            </p>
          </div>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto">
          <button
            onClick={() => setIsPinOpen(true)}
            disabled={isFeeLoading}
            className="w-full py-4 rounded-button bg-sfx-primary text-white font-rh-m text-[15px] disabled:opacity-40"
          >
            Confirm and withdraw
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
              onClick={() => !isLoading && setIsPinOpen(false)}
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
                  Confirm withdrawing $
                  {amountNumber.toFixed(2)}
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
                    disabled={isLoading || !key}
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
