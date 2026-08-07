import type { RootState } from "@/store";
import { AlertTriangle, ClipboardPaste } from "lucide-react";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setExternalAddress, setWithdrawNote } from "@/store/withdrawSlice";
import { isValidEvmAddress } from "@/utils/helper-funcs";

export default function WithdrawAddress() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.withdraw);

  const [address, setAddress] = useState(draft.externalAddress ?? "");
  const [noteInput, setNoteInput] = useState(draft.note);
  const [touched, setTouched] = useState(false);

  const trimmed = address.trim();
  const isValid = trimmed.length > 0 && isValidEvmAddress(trimmed);
  const showError = touched && trimmed.length > 0 && !isValid;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text.trim());
      setTouched(true);
    }
    catch {
    }
  };

  const handleNext = () => {
    if (!isValid) {
      setTouched(true);
      return;
    }
    dispatch(setExternalAddress(trimmed));
    dispatch(setWithdrawNote(noteInput));
    navigate("/withdraw/amount");
  };

  return (
    <section className="md:py-[25px] md:px-screen-x">
      <div className="space-y-[2rem]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/sendmoney")}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="inline-block font-rh-m">
            Withdraw to wallet
          </span>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-6">
          <div className="space-y-2">
            <span className="inline-block text-[14px] text-sfx-muted">Wallet address (Polygon Amoy)</span>
            <div className="relative">
              <input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setTouched(true);
                }}
                placeholder="0x…"
                className={`w-full px-4 py-3 pr-12 rounded-2xl bg-sfx-card font-mono text-[14px] outline-none focus:ring-2 ${
                  showError ? "ring-2 ring-sfx-danger" : "focus:ring-sfx-primary/30"
                }`}
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sfx-primary"
                aria-label="Paste from clipboard"
              >
                <ClipboardPaste className="size-5" />
              </button>
            </div>

            {showError && (
              <p className="flex items-center gap-1.5 text-[13px] text-sfx-danger">
                <AlertTriangle className="size-3.5" />
                That doesn't look like a valid wallet address.
              </p>
            )}
          </div>

          <div className="p-(--spacing-card-pad) rounded-card border border-sfx-danger/30 bg-sfx-danger-bg">
            <p className="text-[13px] leading-[18px] text-sfx-danger">
              Only send to a USDC address on Polygon Amoy. Sending to the wrong network or address type
              will result in permanent loss of funds.
            </p>
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[14px] text-sfx-muted">Note (optional)</span>
            <input
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="What's it for?"
              className="w-full px-4 py-3 rounded-2xl bg-sfx-card font-rh-m text-[15px] outline-none focus:ring-2 focus:ring-sfx-primary/30"
            />
          </div>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto">
          <button
            onClick={handleNext}
            disabled={!isValid}
            className="w-full py-4 rounded-button bg-sfx-primary text-white font-rh-m text-[15px] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
