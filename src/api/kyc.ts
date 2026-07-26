import api from "@/api/axios";

export async function getKycStatus() {
  const response = await api.get("/kyc/status");

  return response.data;
}
