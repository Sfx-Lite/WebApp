export type BeneficiaryType = "internal" | "external";

export type Beneficiary = {
  id: string;
  name: string;
  type: BeneficiaryType;
  identifier: string;
  username?: string;
  profileImage: string | null;
  createdAt: string;
};
