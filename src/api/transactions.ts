import type { Transaction } from "@/lib/types/transaction";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

type PaginatedResponse<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

type TransactionsEnvelope = {
  status: boolean;
  message: string;
  data: PaginatedResponse<Transaction>;
};

export type TransferPayload = {
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

type TransferEnvelope = {
  status: boolean;
  message: string;
  data: TransferResult;
};

export const transactions = createApi({
  reducerPath: "transactionsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Transaction"],
  endpoints: builder => ({
    getTransactions: builder.query<PaginatedResponse<Transaction>, { limit?: number; offset?: number } | void>({
      query: params => ({
        url: "/transactions",
        method: "GET",
        params: params ?? { limit: 20, offset: 0 },
      }),
      transformResponse: (response: TransactionsEnvelope) => response.data,
      providesTags: ["Transaction"],
    }),
    getTransactionById: builder.query<Transaction, string>({
      query: id => ({ url: `/transactions/${id}`, method: "GET" }),
      transformResponse: (response: { data: Transaction }) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Transaction", id }],
    }),
    transferToUser: builder.mutation<TransferResult, TransferPayload>({
      query: payload => ({
        url: "/transactions/transfer",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response: TransferEnvelope) => response.data,
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useTransferToUserMutation,
} = transactions;
