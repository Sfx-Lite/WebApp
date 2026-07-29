import { MdOutlineShield } from "react-icons/md";
import { useNavigate } from "react-router";

import { useKycStatus } from "@/hooks/useKycStatus";

export default function VerifyIdentity() {
  const navigate = useNavigate();

  const { kycData, loading } = useKycStatus();

  if (loading || !kycData) {
    return null;
  }

  const status = kycData.kycStatus;

  // Hide the card completely when the user is verified
  if (status === "verified") {
    return null;
  }

  return (
    <div className="flex gap-4 rounded-card border-2 border-sfx-primary-soft bg-sfx-card p-(--spacing-card-pad)">
      <div>
        <div className="flex size-14 items-center justify-center rounded-2xl bg-sfx-primary/5 sm:size-16">
          <MdOutlineShield className="size-7 text-sfx-primary sm:size-8" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h3 className="font-rh-b text-[16px] leading-[16px]">
            {
              status === "pending"
                ? "Verification Pending"
                : status === "rejected"
                  ? "Verification Required"
                  : "Verify your Identity"
            }
          </h3>

          <p className="text-[15px] leading-[18px] text-sfx-muted">
            {
              status === "pending"
                ? "Your documents are currently being reviewed."
                : status === "rejected"
                  ? "Your verification was rejected. Please submit again."
                  : (
                      <>
                        Sending and withdrawals unlock once you're verified.
                        <br />
                        It takes about 2 minutes.
                      </>
                    )
            }
          </p>
        </div>

        <button
          onClick={() => navigate("/kyc")}
          className="w-fit rounded-full bg-sfx-primary px-8 py-3 text-white transition-transform duration-300 hover:scale-95"
        >
          {
            status === "rejected"
              ? "Retry Verification"
              : status === "pending"
                ? "View Status"
                : "Start Verification"
          }
        </button>
      </div>
    </div>
  );
}
