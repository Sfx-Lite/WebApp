import { useKycStatus } from "@/hooks/useKycStatus";

import { Spinner } from "../ui/spinner";
import KycIntro from "./KycIntro";

import KycPending from "./KycPending";
import KycStatus from "./KycStatus";

export default function KycGate() {
  const { kycData, loading } = useKycStatus();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!kycData) {
    return null;
  }

  switch (kycData.kycStatus) {
    case "pending":
      return (
        <KycPending
          submission={kycData.submission}
        />
      );

    case "verified":
    case "rejected":
      return (
        <div className="flex min-h-screen items-center justify-center">
          <KycStatus
            status={kycData.kycStatus}
            submission={kycData.submission}
          />
        </div>
      );

    case "unverified":
      return <KycIntro />;

    default:
      return null;
  }
}
