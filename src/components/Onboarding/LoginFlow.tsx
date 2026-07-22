import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { pinStatusSet } from "../../store/authSlice";
import PinSetup from "../Form/PinSetup";
import Login from "./Login";

type FlowStep = "login" | "pin";
type PinMode = "set" | "verify";

export default function LoginFlow() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { token, user, hasPin } = useAppSelector(s => s.auth);

  const [step, setStep] = useState<FlowStep>(() =>
    (token && user && !hasPin ? "pin" : "login"));

  const [pinMode, setPinMode] = useState<PinMode>("verify");

  const handleLoginSuccess = (isPin: boolean) => {
    setPinMode(isPin ? "verify" : "set");
    setStep("pin");
  };

  const handleGoogleSuccess = (isNewUser: boolean) => {
    setPinMode(isNewUser ? "set" : "verify");
    setStep("pin");
  };

  const handlePinComplete = () => {
    dispatch(pinStatusSet(true));
    navigate("/");
  };

  return (
    <>
      {step === "login" && (
        <Login onSuccess={handleLoginSuccess} onGoogleSuccess={handleGoogleSuccess} />
      )}
      {step === "pin" && <PinSetup mode={pinMode} onComplete={handlePinComplete} />}
    </>
  );
}
