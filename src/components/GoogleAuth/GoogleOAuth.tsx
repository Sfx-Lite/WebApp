import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function GoogleOAuth() {
  const handleGoogleLogin = () => {
    // browser window needs to navigate to the backend
    const backendUrl = "https://dev-api-sfx-lite.onrender.com";

    // Directed the server initialization route from backend
    window.location.href = `${backendUrl}/api/v1/auth/google`;
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
