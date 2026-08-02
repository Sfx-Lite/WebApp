import { useListBeneficiariesQuery } from "@/api/beneficiaries";

export function useBeneficiaries() {
  const { data, isLoading } = useListBeneficiariesQuery();
  return { beneficiaries: data ?? [], isLoading };
}
