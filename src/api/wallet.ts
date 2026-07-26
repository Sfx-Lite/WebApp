import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export type WalletBalanceData = {
  asset: string;
  network: string;
  balance: string;
};

export type WalletAddressData = {
  asset: string;
  network: string;
  depositAddress: string;
};

type WalletEnvelope<T> = {
  status: boolean;
  message: string;
  data: T;
};

export const wallet = createApi({
  reducerPath: "wallet",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["WalletBalance", "WalletAddress"],
  endpoints: builder => ({
    getWalletBalance: builder.query<WalletBalanceData, void>({
      query: () => ({ url: "/wallets/balance", method: "GET" }),
      transformResponse: (response: WalletEnvelope<WalletBalanceData>) => response.data,
      providesTags: ["WalletBalance"],
    }),
    getWalletAddress: builder.query<WalletAddressData, void>({
      query: () => ({ url: "/wallets/address", method: "GET" }),
      transformResponse: (response: WalletEnvelope<WalletAddressData>) => response.data,
      providesTags: ["WalletAddress"],
    }),
  }),
});

export const { useGetWalletBalanceQuery, useGetWalletAddressQuery } = wallet;
