import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-[#0d091a] p-0 sm:p-4 md:p-6 select-none">

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
        bg-sfx-primary
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

        <div className="p-8 mt-8">
          <span className="text-3xl font-bold text-white font-rh-b">
            SFx Lite
          </span>
        </div>

        <div className="mt-auto p-6">

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
              font-semibold
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

    </div>
  );
}
