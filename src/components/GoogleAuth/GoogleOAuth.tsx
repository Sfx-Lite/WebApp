import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function getGoogle() {
  return (
    window as typeof window & {
      google?: any;
    }
  ).google;
}

export default function GoogleOAuth() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const google = getGoogle();

      if (!google) {
        console.error("Google SDK is not loaded");
        toast.error("Google authentication is currently unavailable.");
        return;
      }

      if (!CLIENT_ID) {
        console.error("Google Client ID missing");
        return;
      }

      const nonceResponse = await api.get("/auth/google/nonce");
      const nonce = nonceResponse.data.data.nonce;

      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        nonce,
        callback: async (googleResponse: any) => {
          try {
            console.log("Google callback fired");
            const credential = googleResponse.credential;

            if (!credential) {
              console.error("No Google credential received");
              return;
            }

            const response = await api.post("/auth/google/verify", {
              idToken: credential,
            });

            console.log("Backend response:", response.data);

            const { accessToken } = response.data.data;

            toast.success("Logged in successfully!");

            navigate("/pin", { state: { from: "google", token: accessToken } });
          }
          catch (error) {
            console.error("Google verification failed:", error);
            toast.error("Account verification failed.");
          }
        },
      });

      google.accounts.id.prompt();
    }
    catch (error) {
      console.error("Google login failed:", error);
      toast.error("Failed to connect to Google.");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      className="
        font-rh-sb
        w-full
        h-(--spacing-button-h)
        rounded-button
        bg-sfx-primary-tint
        text-sfx-primary
        border-sfx-primary-soft
        hover:bg-sfx-ink hover:text-sfx-primary
      "
    >
      <FcGoogle className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}
