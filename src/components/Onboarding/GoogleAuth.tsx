import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { trackEvent } from "@/utils/trackEvent";
import api from "../../api/axios";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { credentialsSet } from "../../store/authSlice";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function getGoogle() {
  return (window as typeof window & { google?: any }).google;
}

type GoogleAuthProps = {
  onSuccess: (isNewUser: boolean) => void;
};

export default function GoogleAuth({ onSuccess }: GoogleAuthProps) {
  const dispatch = useAppDispatch();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    const google = getGoogle();

    if (!google) {
      console.error("Google SDK is not loaded");
      return;
    }

    if (!CLIENT_ID) {
      console.error("Google Client ID missing");
      return;
    }

    let cancelled = false;

    const noncePromise = api.get("/auth/google/nonce");

    const init = async () => {
      try {
        const nonceResponse = await noncePromise;
        const nonce = nonceResponse.data.data.nonce;

        if (cancelled)
          return;

        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          nonce,
          callback: async (googleResponse: any) => {
            try {
              const credential = googleResponse.credential;
              if (!credential) {
                console.error("No Google credential received");
                return;
              }

              const response = await api.post("/auth/google/verify", {
                idToken: credential,
              });

              const { accessToken, refreshToken, user, isNewUser } = response.data?.data ?? {};

              if (accessToken && refreshToken && user) {
                dispatch(credentialsSet({ accessToken, refreshToken, user }));
                if (isNewUser) {
                  trackEvent("signup_completed", { method: "google" });
                }
                toast.success("Logged in successfully!");
                onSuccessRef.current(Boolean(isNewUser));
              }
              else {
                toast.error("Sign-in succeeded but session data was missing.");
              }
            }
            catch (error) {
              console.error("Google verification failed:", error);
              toast.error("Account verification failed.");
            }
          },
        });

        if (buttonRef.current) {
          google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            width: buttonRef.current.offsetWidth,
          });
          setReady(true);
        }
      }
      catch (error) {
        console.error("Google init failed:", error);
        toast.error("Failed to connect to Google.");
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return (
    <div className="w-full flex justify-center">
      {!ready && (
        <div className="h-10 w-full max-w-[240px] animate-pulse rounded-md bg-muted" />
      )}
      <div ref={buttonRef} className={ready ? "w-full flex justify-center" : "hidden"} />
    </div>
  );
}
