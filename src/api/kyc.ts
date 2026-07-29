import type { KycStatusResponse } from "@/lib/types/kyc";
import api from "@/api/axios";

export async function getKycStatus(): Promise<KycStatusResponse> {
  const response = await api.get<KycStatusResponse>("/kyc/status");

  return response.data;
}
