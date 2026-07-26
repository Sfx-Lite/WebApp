import type { DocumentType } from "@/store/kycSlice";

export type KycStatus
  = | "unverified"
    | "pending"
    | "verified"
    | "rejected";

export type KycSubmission = {
  id: string;
  docType: DocumentType;
  status: string;
  reason: string | null;
  createdAt: string;
  reviewedAt: string | null;
};

export type KycStatusResponse = {
  status: boolean;
  message: string;
  data: {
    kycStatus: KycStatus;
    submission: KycSubmission | null;
  };
};
