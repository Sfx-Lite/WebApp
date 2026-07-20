import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import api from "@/api/axios";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { credentialsSet } from "@/store/authSlice";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function getGoogle() {
  return (window as typeof window & { google?: any }).google;
}

export default function GoogleOAuth() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const buttonRef = useRef<HTMLDivElement>(null);

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

    const init = async () => {
      try {
        const nonceResponse = await api.get("/auth/google/nonce");
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

              const { accessToken, refreshToken, user } = response.data?.data ?? {};

              if (accessToken && refreshToken && user) {
                dispatch(credentialsSet({ accessToken, refreshToken, user }));
                toast.success("Logged in successfully!");
                navigate("/pin", { state: { from: "google" } });
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
  }, [dispatch, navigate]);

  return <div ref={buttonRef} className="w-full flex justify-center" />;
}
