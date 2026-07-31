import type { RootState } from "@/store";
import { Delete } from "lucide-react";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useGetWalletBalanceQuery } from "@/api/wallet";
import { setAmount } from "@/store/sendMoneySlice";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"] as const;

export default function Amount() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.sendMoney);
  const { data: balanceData } = useGetWalletBalanceQuery();

  const [amountInput, setAmountInput] = useState(draft.amount || "0");

  const availableBalance = Number(balanceData?.balance ?? 0);
  const enteredAmount = Number(amountInput || 0);
  const isValid = enteredAmount > 0 && enteredAmount <= availableBalance;

  const handleKey = (key: (typeof KEYS)[number]) => {
    if (key === "back") {
      setAmountInput(prev => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      return;
    }
    if (key === "." && amountInput.includes("."))
      return;
    setAmountInput((prev) => {
      if (prev === "0" && key !== ".")
        return key;
      return prev + key;
    });
  };

  const handleSendMax = () => {
    setAmountInput(availableBalance.toFixed(2));
  };

  const handleReview = () => {
    if (!isValid)
      return;
    dispatch(setAmount(amountInput));
    navigate("/sendmoney/sfxs/review");
  };

  if (!draft.recipientUsername) {
    navigate("/sendmoney/sfxs");
    return null;
  }

  return (
    <section className="py-[25px] px-screen-x">
      <div className="space-y-[2rem]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/sendmoney/sfx")}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="inline-block font-rh-m">
            Amount
          </span>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-6">
          <div className="flex items-center gap-3 p-(--spacing-card-pad) bg-sfx-card rounded-card">
            <div className="flex size-10 items-center justify-center rounded-full bg-pink-500 text-white font-rh-b">
              {draft.recipientDisplayName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-rh-b text-[15px]">
                To
                {" "}
                {draft.recipientDisplayName}
              </p>
              <p className="text-[13px] text-sfx-muted">
                @
                {draft.recipientUsername}
                {" "}
                · instant · free
              </p>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h1 className="font-rh-b text-[48px] leading-[48px] text-sfx-ink">
              $
              {amountInput}
            </h1>
            <p className="text-[14px] text-sfx-muted">
              Available balance $
              {availableBalance.toFixed(2)}
              {" "}
              ·
              {" "}
              <button onClick={handleSendMax} className="font-rh-sb text-sfx-primary">
                Send max
              </button>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-y-6 max-w-[320px] mx-auto">
            {KEYS.map(key => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className="flex items-center justify-center text-[26px] font-rh-m text-sfx-ink py-2"
              >
                {key === "back" ? <Delete className="size-6" /> : key}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto">
          <button
            onClick={handleReview}
            disabled={!isValid}
            className="w-full py-4 rounded-button bg-sfx-primary text-white font-rh-m text-[15px] disabled:opacity-40"
          >
            Review
          </button>
        </div>
      </div>
    </section>
  );
}
