import { useState } from "react";

const CORRECT_PIN = 1234;

export default function Pin() {
  const [pin, setPin] = useState<number[]>([]);// saving the state as an array of numbers
  const [error, setError] = useState("");

  const handleNumberClick = (num: number) => {
    if (pin.length < 4) {
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
          setTimeout(() => {
            setError("Incorrect security PIN. Please try again.");
            setPin([]);
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
        <div className="p-8 mt-6">
          <h1 className="text-sfx-ink text-2xl font-rh-m mb-2">
            Transaction PIN
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center mt-24">
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
              <p className="text-sfx-danger text-sm font-rh-r text-center ">
                {error}
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
              onClick={() => handleNumberClick(num)}
              className="w-16 h-16 rounded-full text-sfx-ink font-rh-sb text-[28px] flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:bg-sfx-muted/50 focus:outline-none"
            >
              {num}
            </button>
          ))}

          <div className="w-16 h-16" />

          <button
            type="button"
            onClick={() => handleNumberClick(0)}
            className="w-16 h-16 rounded-full text-sfx-ink font-rh-sb text-[28px] flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:bg-sfx-muted/50 focus:outline-none"
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
