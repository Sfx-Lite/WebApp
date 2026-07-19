import { Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router";

const CORRECT_PIN = 1234;

export default function Pin() {
  const [pin, setPin] = useState<number[]>([]);// saving the state as an array of numbers
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [lockoutEndsAt, setLockoutEndsAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLocked = lockoutEndsAt !== null;

  useEffect (() => {
    if (!lockoutEndsAt)
      return;

    intervalRef.current = setInterval(() => {
      const secondsLeft = Math.ceil((lockoutEndsAt - Date.now()) / 1000);

      if (secondsLeft <= 0) {
        setLockoutEndsAt(null);
        setWrongAttempts(0);
        setError("");
        if (intervalRef.current)
          clearInterval(intervalRef.current);
      }
      else {
        setRemainingSeconds(secondsLeft);
      }
    }, 1000);
    return () => {
      if (intervalRef.current)
        clearInterval(intervalRef.current);
    };
  }, [lockoutEndsAt]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleNumberClick = (num: number) => {
    if (isLocked || pin.length < 4) {
      const newPin = [...pin, num]; // returns the numbers that are already in the pin array , then  adds the new number to the end of the array
      setPin(newPin);
      setError("");

      if (newPin.length === 4) {
        if (newPin.join("") === CORRECT_PIN.toString()) {
          setTimeout(() => {
            setPin([]);
          }, 250);
        }
        else {
          const attempts = wrongAttempts + 1;
          setWrongAttempts(attempts);
          setTimeout(() => {
            setPin([]);

            if (attempts >= 5) {
              const lockDurationMs = 15 * 60 * 1000;
              setLockoutEndsAt(Date.now() + lockDurationMs);
              setRemainingSeconds(15 * 60);
              setError("Too many incorrect attempts. Try again later.");
            }
            else {
              setError(
                `Incorrect security PIN. Please try again. (${5 - attempts} attempt${5 - attempts === 1 ? "" : "s"} left)`,
              );
            }
          }, 400);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError("");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-[#0d091a] p-0 sm:p-4 md:p-6 select-none">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-sfx-primary opacity-20 blur-[150px]" />

        <div className="absolute -bottom-[30%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-sfx-primary opacity-20 blur-[150px]" />
      </div>

      <div
        className="
          relative
          w-full
          h-screen
          sm:h-[844px]
          sm:w-[390px]
          bg-sfx-primary-tint
          sm:rounded-[44px]
          shadow-brand
          sm:border-[10px]
          sm:border-[#221a38]
          flex
          flex-col
          overflow-hidden
          transition-all
          duration-300
          "
      >
        <div className="p-8 mt-6 flex items-center">
          <button
            onClick={() =>
              navigate("/register")}
            className="flex items-center justify-center w-10 h-10 bg-white rounded-full cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
          >
            <IoIosArrowBack className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-sfx-ink text-xl font-rh-m ml-4">
            Transaction PIN
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center mt-1">
          <div className="flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-sm mb-8">
            <Shield className="w-10 h-10 text-sfx-primary-strong" />
          </div>

          <h2 className="mb-2 font-rh-sb text-2xl ">Set your 4-digit PIN</h2>
          <p className="text-sfx-muted text-sm text-center mb-8">
            You'll confirm every transfer with this PIN.
            <br />
            Staff will never ask you for it.
          </p>

          <div className="flex gap-6 mb-4">
            {[0, 1, 2, 3].map(index => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-150 ${
                  pin.length > index
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

        {/* The keypad grid for user to enter pin */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-8 w-full max-w-[270px] mx-auto mt-24">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              type="button"
              disabled={isLocked}
              onClick={() => handleNumberClick(num)}
              className={`w-16 h-16 rounded-full text-sfx-ink font-rh-sb text-[28px] flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:bg-sfx-muted/50 focus:outline-none ${isLocked ? "opacity-30 cursor-not-allowed " : "cursor-pointer hover:bg-sfx-muted/50"}`}
            >
              {num}
            </button>
          ))}

          <div className="w-16 h-16" />

          <button
            type="button"
            disabled={isLocked}
            onClick={() => handleNumberClick(0)}
            className={`w-16 h-16 rounded-full text-sfx-ink font-rh-sb text-[28px] flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:bg-sfx-muted/50 focus:outline-none ${isLocked ? "opacity-30 cursor-not-allowed " : "cursor-pointer hover:bg-sfx-muted/50"}`}
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="w-16 h-16 rounded-full text-sfx-ink font-rh-b text-lg flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:bg-sfx-muted focus:outline-none"
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
}
