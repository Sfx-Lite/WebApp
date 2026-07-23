import type { RegisterFormData } from "../../lib/schemas/schema";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import appstoreIcon from "../../assets/icons/appstore.png";
import playstoreIcon from "../../assets/icons/google-play.png";
import sfxbarcode from "../../assets/imgs/sfx-barcode.svg";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { pinStatusSet } from "../../store/authSlice";
import PinSetup from "../Form/PinSetup";

import Register from "./Register";
import RegistrationTimeline from "./RegistrationTimeline";
import RegistrationTimelineMobile from "./RegistrationTimelineMobile";

type FlowStep = "register" | "pin";
type PinMode = "set" | "verify";

export default function RegisterFlow() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<FlowStep>("register");
  const [pinMode, setPinMode] = useState<PinMode>("set");
  const [registerData, setRegisterData] = useState<RegisterFormData | null>(null);

  const currentStep = step === "register" ? 0 : 1;

  const handleRegisterSuccess = (data: RegisterFormData) => {
    setRegisterData(data);
    dispatch(pinStatusSet(false));
    setPinMode("set");
    setStep("pin");
  };

  const handleGoogleSuccess = (isPin: boolean) => {
    setPinMode(isPin ? "verify" : "set");
    setStep("pin");
  };

  const handleBackToRegister = () => {
    setStep("register");
  };

  const handlePinComplete = () => {
    dispatch(pinStatusSet(true));
    navigate("/");
  };

  return (
    <section className="flex gap-[5rem] pb-[3rem]">
      <div className="hidden w-[20%] md:w-[30%] md:flex flex-col h-full justify-between">
        <RegistrationTimeline currentStep={currentStep} />

        <div className="mt-10 rounded-3xl bg-white border border-black/5 shadow-xl md:p-4 p-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <img src={playstoreIcon} alt="Google Play" className="h-8 w-8" />
            <img src={appstoreIcon} alt="App Store" className="h-8 w-8 rounded-full" />
          </div>
          <img src={sfxbarcode} alt="Scan to download SFx money app" className="h-36 w-36" />
          <p className="mt-4 text-sfx-muted text-[15px] leading-[1.4]">
            Scan the QR code to
            {" "}
            <br />
            {" "}
            download SFx money app
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "register" && (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full md:w-[60%] lg:w-[40%]"
          >
            <div className="md:hidden flex items-center justify-center mb-4">
              <RegistrationTimelineMobile currentStep={currentStep} />
            </div>
            <Register defaultValues={registerData ?? undefined} onSuccess={handleRegisterSuccess} onGoogleSuccess={handleGoogleSuccess} />
          </motion.div>
        )}

        {step === "pin" && (
          <motion.div
            key="pin"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full lg:w-[40%]"
          >
            <PinSetup
              mode={pinMode}
              onComplete={handlePinComplete}
              onBack={handleBackToRegister}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
