/* eslint-disable react/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
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

  useEffect(() => {
    if (step === "pin" && (!token || !user)) {
      toast.error("Your session has expired. Please log in again.");
      setStep("login");
    }
  }, [step, token, user]);

  const handleAuthSuccess = (isPin: boolean) => {
    setPinMode(isPin ? "verify" : "set");
    setStep("pin");
  };

  const handlePinComplete = () => {
    dispatch(pinStatusSet(true));
    navigate("/");
  };

  return (
    <>
      {step === "login" && (
        <Login onSuccess={handleAuthSuccess} onGoogleSuccess={handleAuthSuccess} />
      )}
      {step === "pin" && <PinSetup mode={pinMode} onComplete={handlePinComplete} />}
    </>
  );
}
