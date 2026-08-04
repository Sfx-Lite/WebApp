import type { FeeCalculation } from "@/lib/types/fee";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

type FeeEnvelope = {
  status: boolean;
  message: string;
  data: FeeCalculation;
};

export type CalculateFeeParams = {
  amount: number;
  from: string;
  to: string;
};

export const fees = createApi({
  reducerPath: "fees",
  baseQuery: axiosBaseQuery(),
  endpoints: builder => ({
    calculateFee: builder.query<FeeCalculation, CalculateFeeParams>({
      query: params => ({
        url: "/fees/calculate",
        method: "GET",
        params,
      }),
      transformResponse: (response: FeeEnvelope) => response.data,
    }),
  }),
});

export const { useCalculateFeeQuery, useLazyCalculateFeeQuery } = fees;
