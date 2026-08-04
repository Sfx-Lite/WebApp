import type { WithdrawalResult } from "@/lib/types/withdrawal";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

type WithdrawalEnvelope = {
  status: boolean;
  message: string;
  data: WithdrawalResult;
};

export type WithdrawPayload = {
  amount: string;
  externalAddress: string;
  pin: string;
  note?: string;
};

export const withdrawals = createApi({
  reducerPath: "withdrawals",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Transaction"],
  endpoints: builder => ({
    withdraw: builder.mutation<WithdrawalResult, WithdrawPayload>({
      query: payload => ({
        url: "/withdrawals",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response: WithdrawalEnvelope) => response.data,
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const { useWithdrawMutation } = withdrawals;
