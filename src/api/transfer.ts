import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export type TransferRequest = {
  recipientUsername: string;
  amount: string;
  note?: string;
};

export type TransferResult = {
  transactionId: string;
  amount: string;
  asset: string;
  recipient: string;
  balanceAfter: string;
};

type ApiEnvelope<T> = {
  status: boolean;
  message: string;
  data: T;
};

export const transfer = createApi({
  reducerPath: "transfer",
  baseQuery: axiosBaseQuery(),
  endpoints: builder => ({
    transfer: builder.mutation<TransferResult, TransferRequest>({
      query: body => ({
        url: "/transactions/transfer",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: ApiEnvelope<TransferResult>) => response.data,
    }),
  }),
});

export const { useTransferMutation } = transfer;
