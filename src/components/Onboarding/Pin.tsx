import { useEffect, useState } from "react";
import { MdArrowBack, MdOutlineShield } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router";
import api from "@/api/axios";

type FlowMode = "set" | "confirm" | "verify";

export default function Pin() {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegisterFlow = location.state?.from === "register" || "google";

  const [mode, setMode] = useState<FlowMode>(isRegisterFlow ? "set" : "verify");
  const [pin, setPin] = useState<number[]>([]);
  const [firstPin, setFirstPin] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (lockoutTimeLeft <= 0)
      return;

    const timer = setInterval(() => {
      setLockoutTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutTimeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetToInitialSetMode = () => {
    setPin([]);
    setFirstPin("");
    setMode("set");
  };

  const handleFailedVerifyAttempt = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setPin([]);

    if (nextAttempts >= 5) {
      setError("");
      setLockoutTimeLeft(15 * 60);
    }
    else {
      setError(
        `Incorrect security PIN. ${5 - nextAttempts} attempts remaining.`,
      );
    }
  };

  const handleNumberClick = async (num: number) => {
    if (lockoutTimeLeft > 0 || isLoading)
      return;
    if (pin.length < 4) {
      const newPin = [...pin, num];
      setPin(newPin);
      setError("");

      if (newPin.length === 4) {
        const pinString = newPin.join("");

        if (mode === "set") {
          setTimeout(() => {
            setFirstPin(pinString);
            setPin([]);
            setMode("confirm");
          }, 250);
        }
        else if (mode === "confirm") {
          if (pinString === firstPin) {
            setIsLoading(true);
            try {
              const response = await api.post("auth/pin", {
                pin: pinString,
              });

              if (response.status === 200 || response.status === 201) {
                setTimeout(() => {
                  setPin([]);
                  navigate("/");
                }, 250);
              }
              else {
                setError("Failed to set PIN. Try again.");
                resetToInitialSetMode();
              }
            }
            catch (err: any) {
              setError(
                err.response?.data?.message
                || "Network error. Please try again.",
              );
              resetToInitialSetMode();
            }
            finally {
              setIsLoading(false);
            }
          }
          else {
            setTimeout(() => {
              setError("PINs do not match. Start over.");
              resetToInitialSetMode();
            }, 400);
          }
        }
        else if (mode === "verify") {
          setIsLoading(true);
          try {
            const response = await api.post("/auth/pin/verify", {
              pin: pinString,
            });

            if (response.status === 200) {
              setTimeout(() => {
                setPin([]);
                navigate("/");
              }, 250);
            }
            else {
              handleFailedVerifyAttempt();
            }
          }
          catch {
            handleFailedVerifyAttempt();
          }
          finally {
            setIsLoading(false);
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    if (lockoutTimeLeft > 0 || isLoading)
      return;
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError("");
    }
  };

  const getHeadingText = () => {
    if (mode === "set")
      return "Set your 4-digit PIN";
    if (mode === "confirm")
      return "Confirm your 4-digit PIN";
    return "Enter transaction PIN";
  };

  const getDescriptionText = () => {
    if (mode === "confirm")
      return "Please re-enter your selection to match.";
    return "You'll confirm every transfer with this PIN.\nStaff will never ask you for it.";
  };

  return (
    <div className="flex p-4 flex-col justify-between h-screen w-full bg-sfx-primary-tint">
      <div className="flex-1 ">
        <div className="py-4 mt-2">
          <div className="flex items-center gap-2">
            <Link
              to={isRegisterFlow ? "/register" : "/login"}
              className="text-sfx-muted hover:text-sfx-ink transition-colors"
            >
              <MdArrowBack className="size-6" />
            </Link>
            <h1 className="font-rh-sb text-xl">Transaction PIN</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-14">
          <MdOutlineShield className="size-8 text-sfx-primary-strong" />
          <h2 className="font-rh-sb text-2xl text-center h-8">
            {lockoutTimeLeft > 0 ? "Account Locked" : getHeadingText()}
          </h2>

          <p className="text-sfx-muted text-sm text-center mb-8 whitespace-pre-line min-h-10">
            {lockoutTimeLeft > 0
              ? `Too many incorrect attempts. Please try again in ${formatTime(lockoutTimeLeft)}.`
              : getDescriptionText()}
          </p>

          <div className="flex gap-6 mb-1">
            {[0, 1, 2, 3].map(index => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-150 ${
                  lockoutTimeLeft > 0
                    ? "bg-sfx-muted/40 cursor-not-allowed"
                    : pin.length > index
                      ? "bg-sfx-primary-strong scale-110 shadow-brand"
                      : "bg-sfx-muted/80"
                }`}
              />
            ))}
          </div>

          <div className="h-6">
            {error && (
              <p className="text-sfx-danger text-sm font-rh-r text-center">
                {error}
              </p>
            )}
            {isLocked && (
              <p className="text-sfx-danger text-sm font-rh-sb text-center mt-1">
                Locked out — try again in
                {" "}
                {formatTime(remainingSeconds)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-y-4 gap-x-8 w-full max-w-[270px] mx-auto mt-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              type="button"
              disabled={lockoutTimeLeft > 0 || isLoading}
              onClick={() => handleNumberClick(num)}
              className="w-16 h-16 rounded-full text-sfx-ink font-rh-sb text-[28px] flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:bg-sfx-muted/50 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {num}
            </button>
          ))}

          <div className="w-16 h-16" />

          <button
            type="button"
            disabled={lockoutTimeLeft > 0 || isLoading}
            onClick={() => handleNumberClick(0)}
            className="w-16 h-16 rounded-full text-sfx-ink font-rh-sb text-[28px] flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:bg-sfx-muted/50 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          >
            0
          </button>

          <button
            type="button"
            disabled={lockoutTimeLeft > 0 || isLoading}
            onClick={handleBackspace}
            className="w-16 h-16 rounded-full text-sfx-ink font-rh-b text-3xl flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:bg-sfx-muted focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
}
