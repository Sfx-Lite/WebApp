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
  }),
});

export const { useGetTransactionsQuery, useGetTransactionByIdQuery } = transactions;
