import type { KycStatus } from "@/lib/types/kyc";

export const KYC_BADGES: Record<
  KycStatus,
  {
    text: string;
    className: string;
  }
> = {
  unverified: {
    text: "Not Verified",
    className: "bg-sfx-primary-tint text-sfx-muted",
  },

  pending: {
    text: "Pending",
    className: "bg-sfx-warning-bg text-sfx-warning",
  },

  verified: {
    text: "Verified",
    className: "bg-sfx-success-bg text-sfx-success",
  },

  rejected: {
    text: "Rejected",
    className: "bg-sfx-danger-bg text-sfx-danger",
  },
};
