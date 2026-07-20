import { useNavigate } from "react-router";
import logowhite from "@/assets/imgs/sfx-logo-white.png";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex p-4 flex-col justify-between h-screen w-full bg-sfx-primary">
      <div className="py-2 mt-4">
        <img src={logowhite} className="w-[150px]" />
      </div>

      <div className="p-2">
        <h1
          className="
            text-[34px]
            leading-[1.1]
            font-bold
            tracking-tight
            text-white
            font-rh-b
            "
        >
          Money that moves
          <br />
          like a message.
        </h1>

        <p
          className="
            mt-4
            text-white/80
            text-[15px]
            leading-relaxed
            max-w-sm
            font-rh-r
            "
        >
          Deposit, send and receive test USDC instantly —
          <br />
          built by Cohort 1 on Polygon Amoy.
        </p>

        <div className="mt-8 space-y-3">
          <Button
            onClick={() => navigate("/register")}
            className="
              w-full
              h-(--spacing-button-h)
              rounded-button
              bg-white
              text-sfx-primary
              hover:bg-white/90
              text-base
              font-rh-sb
              shadow-brand
              "
          >
            Get started
          </Button>

          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="
              w-full
              h-(--spacing-button-h)
              rounded-button
              bg-transparent
              border-white/60
              text-white
              hover:bg-white/10
              hover:text-white
              text-base
              font-bold
              "
          >
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
}
