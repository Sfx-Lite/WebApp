import type { Beneficiary, BeneficiaryType } from "@/lib/types/beneficiary";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

type BeneficiaryEnvelope = {
  status: boolean;
  message: string;
  data: Beneficiary;
};

type BeneficiaryListEnvelope = {
  status: boolean;
  message: string;
  data: Beneficiary[];
};

export type SaveBeneficiaryPayload = {
  type: BeneficiaryType;
  identifier: string;
  name: string;
};

export const beneficiaries = createApi({
  reducerPath: "beneficiaries",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Beneficiary"],
  endpoints: builder => ({
    listBeneficiaries: builder.query<Beneficiary[], void>({
      query: () => ({ url: "/beneficiaries", method: "GET" }),
      transformResponse: (response: BeneficiaryListEnvelope) => response.data,
      providesTags: result =>
        result
          ? [
              ...result.map(b => ({ type: "Beneficiary" as const, id: b.id })),
              { type: "Beneficiary" as const, id: "LIST" },
            ]
          : [{ type: "Beneficiary" as const, id: "LIST" }],
    }),
    saveBeneficiary: builder.mutation<Beneficiary, SaveBeneficiaryPayload>({
      query: payload => ({ url: "/beneficiaries", method: "POST", data: payload }),
      transformResponse: (response: BeneficiaryEnvelope) => response.data,
      invalidatesTags: [{ type: "Beneficiary", id: "LIST" }],
    }),
    removeBeneficiary: builder.mutation<void, string>({
      query: id => ({ url: `/beneficiaries/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Beneficiary", id }],
    }),
  }),
});

export const {
  useListBeneficiariesQuery,
  useSaveBeneficiaryMutation,
  useRemoveBeneficiaryMutation,
} = beneficiaries;
