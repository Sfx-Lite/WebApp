/* eslint-disable react/no-array-index-key */
/* eslint-disable react/naming-convention-ref-name */
/* eslint-disable unicorn/no-new-array */
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import axios from "axios";
import { ArrowLeft, Delete } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import api from "../api/axios";
import { useIsMobile } from "../hooks/useIsMobile";

type ChangePinPhase = "current" | "new" | "confirm";

type ChangePinSetupProps = {
  length?: number;
  onComplete: () => void;
  onBack?: () => void;
};

const VERIFY_PIN_URL = "/auth/pin/verify";
const CHANGE_PIN_URL = "/auth/pin/reset";

const KEYPAD_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "",
  "0",
  "back",
] as const;

const COPY: Record<
  ChangePinPhase,
  {
    title: string;
    subtitle: (length: number) => string;
  }
> = {
  current: {
    title: "Enter your current PIN",
    subtitle: length => `Enter your ${length}-digit PIN`,
  },

  new: {
    title: "Create a new PIN",
    subtitle: length => `Enter your new ${length}-digit PIN`,
  },

  confirm: {
    title: "Confirm your new PIN",
    subtitle: length => `Re-enter your ${length}-digit PIN`,
  },
};

export default function ChangePinSetup({
  length = 4,
  onComplete,
  onBack,
}: ChangePinSetupProps) {
  const isMobile = useIsMobile();

  const [phase, setPhase] = useState<ChangePinPhase>("current");

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const [digits, setDigits] = useState<string[]>(() =>
    new Array(length).fill(""),
  );

  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isMobile) {
      inputRefs.current[0]?.focus();
    }
  }, [phase, isMobile]);

  const setDigitAt = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const resetToStart = () => {
    setPhase("current");
    setCurrentPin("");
    setNewPin("");
    setDigits(new Array(length).fill(""));
    setError(null);

    if (!isMobile) {
      requestAnimationFrame(() => inputRefs.current[0]?.focus());
    }
  };

  const clearForRetry = () => {
    setDigits(new Array(length).fill(""));
    if (!isMobile)
      inputRefs.current[0]?.focus();
  };

  const verifyCurrentPin = async (pin: string) => {
    setIsSubmitting(true);

    try {
      await api.post(VERIFY_PIN_URL, {
        pin,
      });

      setError(null);
      setCurrentPin(pin);
      setDigits(new Array(length).fill(""));
      setPhase("new");
    }
    catch (err) {
      const message = axios.isAxiosError<{ message: string }>(err)
        ? (err.response?.data?.message ?? "Incorrect PIN")
        : "Incorrect PIN";

      setError(message);
      toast.error(message);
      clearForRetry();
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const changePin = async (confirmedPin: string) => {
    setIsSubmitting(true);

    try {
      await api.post(CHANGE_PIN_URL, {
        oldPin: currentPin,
        newPin: confirmedPin,
      });

      toast.success("PIN changed successfully!");

      onComplete();
    }
    catch (err) {
      const message = axios.isAxiosError<{ message: string }>(err)
        ? (err.response?.data?.message ?? "Failed to change PIN.")
        : "Failed to change PIN.";

      setError(message);
      toast.error(message);
      clearForRetry();
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const handleCompletedEntry = (pin: string) => {
    if (phase === "current") {
      verifyCurrentPin(pin);
      return;
    }

    if (phase === "new") {
      if (pin === currentPin) {
        setError("Your new PIN must be different from your current PIN.");
        clearForRetry();
        return;
      }

      setError(null);
      setNewPin(pin);
      setDigits(new Array(length).fill(""));
      setPhase("confirm");
      return;
    }

    if (phase === "confirm") {
      if (pin !== newPin) {
        setError("PINs do not match.");
        clearForRetry();
        return;
      }

      changePin(pin);
    }
  };

  // Shared entry point for both native typing and on-screen taps: appends
  // one digit into the first empty slot, then checks for completion.
  const pushDigit = (digit: string) => {
    if (isSubmitting)
      return;

    const nextIndex = digits.findIndex(d => d === "");
    if (nextIndex === -1)
      return; // already full

    setError(null);
    const next = [...digits];
    next[nextIndex] = digit;
    setDigits(next);

    if (!isMobile) {
      inputRefs.current[nextIndex + 1]?.focus();
    }

    const completed = next.join("");
    if (completed.length === length && next.every(d => d !== "")) {
      handleCompletedEntry(completed);
    }
  };

  const popDigit = () => {
    if (isSubmitting)
      return;

    setError(null);
    setDigits((prev) => {
      const lastFilledIndex = [...prev].reverse().findIndex(d => d !== "");
      if (lastFilledIndex === -1)
        return prev;

      const index = prev.length - 1 - lastFilledIndex;
      const next = [...prev];
      next[index] = "";

      if (!isMobile) {
        requestAnimationFrame(() => inputRefs.current[index]?.focus());
      }

      return next;
    });
  };

  // Desktop-only native input handlers
  const handleChange
    = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
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

      const completed = digits
        .map((d, i) => (i === index ? nextDigit : d))
        .join("");
      if (completed.length !== length)
        return;

      handleCompletedEntry(completed);
    };

  const handleKeyDown
    = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
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
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
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

  const handleKeypadPress = (key: (typeof KEYPAD_KEYS)[number]) => {
    if (!key)
      return;
    if (key === "back") {
      popDigit();
      return;
    }
    pushDigit(key);
  };

  const copy = COPY[phase];

  return (
    <div className="w-full">
      <div className="space-y-[2.25rem]">
        <div className="flex flex-col items-center text-center">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="mb-4 self-start text-sfx-ink hover:text-sfx-primary transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <h1 className="text-[1.5rem] mb-1 font-rh-sb">{copy.title}</h1>
          <p className="text-[1rem] leading-[1.25rem] text-sfx-muted">
            {copy.subtitle(length)}
          </p>
          <div className="mt-8">
            {isSubmitting && (
              <p className="text-sm text-sfx-muted flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-sfx-primary border-t-transparent rounded-full animate-spin" />
                {phase === "current"
                  ? "Verifying your PIN..."
                  : "Changing your PIN..."}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 flex flex-col items-center">
          <div className="flex gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isSubmitting}
                readOnly={isMobile}
                onChange={isMobile ? undefined : handleChange(index)}
                onKeyDown={isMobile ? undefined : handleKeyDown(index)}
                onPaste={isMobile ? undefined : handlePaste}
                onFocus={e => isMobile && e.target.blur()}
                className={`w-[3.25rem] h-[3.25rem] rounded-2xl border-2 bg-white text-center
                           text-lg font-rh-sb outline-none transition-colors
                           disabled:opacity-50
                           ${error ? "border-sfx-danger" : "border-sfx-muted/30 focus:border-sfx-primary"}`}
              />
            ))}
          </div>

          {error && <p className="text-sm text-sfx-danger">{error}</p>}

          {phase === "confirm" && (
            <button
              type="button"
              onClick={resetToStart}
              className="text-sm text-sfx-primary underline"
            >
              Start over
            </button>
          )}
        </div>

        {isMobile && (
          <div className="grid grid-cols-3 gap-y-4 max-w-[280px] mx-auto pt-2">
            {KEYPAD_KEYS.map((key, i) => (
              <button
                key={i}
                type="button"
                disabled={isSubmitting || !key}
                onClick={() => handleKeypadPress(key)}
                className="flex items-center justify-center text-[24px] font-rh-m py-3 disabled:opacity-0"
              >
                {key === "back" ? <Delete className="size-5" /> : key}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
