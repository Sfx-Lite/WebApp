/* eslint-disable react/no-array-index-key */
/* eslint-disable react/naming-convention-ref-name */
/* eslint-disable unicorn/no-new-array */
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import api from "../../api/axios";

type PinMode = "set" | "verify";
type PinPhase = "enter" | "confirm";

type PinSetupProps = {
  mode: PinMode;
  length?: number;
  onComplete: () => void;
  onBack?: () => void;
};

const SET_PIN_URL = "/auth/pin";
const VERIFY_PIN_URL = "/auth/pin/verify";

const COPY: Record<PinMode, Record<PinPhase, { title: string; subtitle: (length: number) => string }>> = {
  set: {
    enter: {
      title: "Set your transaction PIN",
      subtitle: length => `Choose a ${length}-digit PIN to authorize your transactions`,
    },
    confirm: {
      title: "Confirm your PIN",
      subtitle: () => "Enter the same PIN again to confirm",
    },
  },
  verify: {
    enter: {
      title: "Enter your transaction PIN",
      subtitle: length => `Enter your ${length}-digit PIN to continue`,
    },
    confirm: {
      title: "Enter your transaction PIN",
      subtitle: length => `Enter your ${length}-digit PIN to continue`,
    },
  },
};

export default function PinSetup({ mode, length = 4, onComplete, onBack }: PinSetupProps) {
  const [phase, setPhase] = useState<PinPhase>("enter");
  const [firstPin, setFirstPin] = useState("");
  const [digits, setDigits] = useState<string[]>(() => new Array(length).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [phase]);

  const setDigitAt = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const resetToStart = () => {
    setPhase("enter");
    setFirstPin("");
    setDigits(new Array(length).fill(""));
    setError(null);
  };

  const clearForRetry = () => {
    setDigits(new Array(length).fill(""));
    inputRefs.current[0]?.focus();
  };

  const submitPin = async (pin: string) => {
    setIsSubmitting(true);
    try {
      if (mode === "set") {
        await api.post(SET_PIN_URL, { pin });
        toast.success("Transaction PIN set successfully!");
      }
      else {
        await api.post(VERIFY_PIN_URL, { pin });
        toast.success("PIN verified successfully!");
      }
      onComplete();
    }
    catch (err) {
      const fallback = mode === "set" ? "Failed to set PIN." : "Incorrect PIN. Please try again.";
      const message = axios.isAxiosError<{ message: string }>(err)
        ? err.response?.data?.message ?? fallback
        : fallback;

      setError(message);
      toast.error(message);

      if (mode === "set") {
        resetToStart();
      }
      else {
        clearForRetry();
      }
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const handleCompletedEntry = (completed: string) => {
    if (mode === "verify") {
      submitPin(completed);
      return;
    }

    if (phase === "enter") {
      setFirstPin(completed);
      setDigits(new Array(length).fill(""));
      setPhase("confirm");
      return;
    }

    if (completed === firstPin) {
      submitPin(completed);
    }
    else {
      setError("PINs don't match. Try again.");
      clearForRetry();
    }
  };

  const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setDigitAt(index, "");
      return;
    }

    const nextDigit = raw.slice(-1);
    setDigitAt(index, nextDigit);
    setError(null);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      return;
    }

    const completed = digits.map((d, i) => (i === index ? nextDigit : d)).join("");
    if (completed.length !== length)
      return;

    handleCompletedEntry(completed);
  };

  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted)
      return;
    e.preventDefault();

    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < length; i++) {
        next[i] = pasted[i] ?? next[i];
      }
      return next;
    });

    if (pasted.length !== length)
      return;

    handleCompletedEntry(pasted);
  };

  const copy = COPY[mode][phase];

  return (
    <div className="w-full">
      <div className="space-y-[2.25rem]">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="mb-4 text-sfx-ink hover:text-sfx-primary transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <h1 className="text-[1.5rem] mb-1 font-rh-sb">
            {copy.title}
          </h1>
          <p className="text-[1rem] leading-[1.25rem] text-sfx-muted">
            {copy.subtitle(length)}
          </p>
        </div>

        <div className="space-y-3 flex flex-col items-center">
          <div className="flex gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isSubmitting}
                onChange={handleChange(index)}
                onKeyDown={handleKeyDown(index)}
                onPaste={handlePaste}
                className={`w-[3.25rem] h-[3.25rem] rounded-2xl border-2 bg-white text-center
                           text-lg font-rh-sb outline-none transition-colors
                           disabled:opacity-50
                           ${error ? "border-sfx-danger" : "border-sfx-muted/30 focus:border-sfx-primary"}`}
              />
            ))}
          </div>

          {error && <p className="text-sm text-sfx-danger">{error}</p>}

          {mode === "set" && phase === "confirm" && (
            <button
              type="button"
              onClick={resetToStart}
              className="text-sm text-sfx-primary underline"
            >
              Start over
            </button>
          )}
        </div>

        {isSubmitting && (
          <p className="text-sm text-sfx-muted flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-sfx-primary border-t-transparent rounded-full animate-spin" />
            {mode === "set" ? "Setting your PIN..." : "Verifying your PIN..."}
          </p>
        )}
      </div>
    </div>
  );
}
