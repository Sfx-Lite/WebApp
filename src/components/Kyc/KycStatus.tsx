import type { KycSubmission } from "@/lib/types/kyc";
import Confetti from "react-confetti";
import { MdCheckCircleOutline, MdErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router";
import { useWindowSize } from "react-use";

import { Button } from "@/components/ui/button";

type KycStatusProps = {
  status: "verified" | "rejected";
  submission: KycSubmission | null;
};

export default function KycStatus({
  status,
  submission,
}: KycStatusProps) {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  if (status === "verified") {
    return (
      <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-sfx-primary-tint p-4">
        <Confetti
          width={width}
          height={height}
          recycle={false}
        />

        <div className="flex w-full max-w-md flex-col items-center rounded-panel border border-sfx-primary-tint/30 bg-white/70 p-6 text-center shadow-brand sm:p-8">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-sfx-success-bg ring-8 ring-sfx-success-bg/50">
            <MdCheckCircleOutline className="size-10 text-sfx-success" />
          </div>

          <h1 className="mb-3 font-rh-sb text-xl text-sfx-ink sm:text-2xl">
            Verification complete
          </h1>

          <p className="mb-8 max-w-sm font-rh-r text-sm leading-relaxed text-sfx-muted">
            Your identity has been successfully verified. You can now continue
            using all available wallet features.
          </p>

          <Button
            onClick={() => navigate("/settings")}
            className="h-button-h w-full rounded-button bg-sfx-primary font-rh-sb text-base text-white shadow-brand hover:bg-sfx-primary-strong"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-sfx-primary-tint p-4">
        <div className="flex w-full max-w-md flex-col items-center rounded-panel border border-sfx-primary-tint/30 bg-white/70 p-6 text-center shadow-brand sm:p-8">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-sfx-danger-bg ring-8 ring-sfx-danger-bg/50">
            <MdErrorOutline className="size-10 text-sfx-danger" />
          </div>

          <h1 className="mb-3 font-rh-sb text-xl text-sfx-ink sm:text-2xl">
            Verification failed
          </h1>

          <p className="mb-6 max-w-sm font-rh-r text-sm leading-relaxed text-sfx-muted">
            We could not verify your identity. Please review the reason below
            and submit your documents again.
          </p>

          <div className="mb-8 w-full rounded-card bg-white p-4 text-left shadow-brand">
            <p className="mb-2 font-rh-r text-xs text-sfx-muted">
              Reason
            </p>

            <p className="font-rh-sb text-sm text-sfx-ink">
              {submission?.reason ?? "No reason provided"}
            </p>
          </div>

          <Button
            onClick={() => navigate("/kyc")}
            className="h-button-h w-full rounded-button bg-sfx-primary font-rh-sb text-base text-white shadow-brand hover:bg-sfx-primary-strong"
          >
            Resubmit documents
          </Button>

          <button
            type="button"
            onClick={() => navigate("/support")}
            className="mt-4 font-rh-sb text-sm text-sfx-primary hover:underline"
          >
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  return null;
}
