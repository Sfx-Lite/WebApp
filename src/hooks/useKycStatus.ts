import type { KycStatusResponse } from "@/lib/types/kyc";
import { useEffect, useState } from "react";
import { getKycStatus } from "@/api/kyc";

export function useKycStatus() {
  const [kycData, setKycData]
    = useState<KycStatusResponse["data"] | null>(null);

  const [loading, setLoading] = useState(true);

  async function fetchStatus() {
    try {
      const response = await getKycStatus();

      setKycData(response.data);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    kycData,
    loading,
    refetch: fetchStatus,
  };
}
