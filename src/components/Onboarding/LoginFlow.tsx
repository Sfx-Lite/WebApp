import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { pinStatusSet } from "../../store/authSlice";
import PinSetup from "../Form/PinSetup";
import Login from "./Login";

type FlowStep = "login" | "pin";

export default function LoginFlow() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { token, user, hasPin } = useAppSelector(s => s.auth);

  const [step, setStep] = useState<FlowStep>(() =>
    (token && user && !hasPin ? "pin" : "login"));

  const handleLoginSuccess = (isPin: boolean) => {
    dispatch(pinStatusSet(isPin));
    if (isPin) {
      navigate("/");
    }
    else {
      setStep("pin");
    }
  };

  const handleGoogleSuccess = (isNewUser: boolean) => {
    if (isNewUser) {
      dispatch(pinStatusSet(false));
      setStep("pin");
    }
    else {
      dispatch(pinStatusSet(true));
      navigate("/");
    }
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
      {step === "pin" && <PinSetup mode="set" onComplete={handlePinComplete} />}
    </>
  );
}
