import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export type VerifyPinResult = {
  verified: boolean;
};

type VerifyPinEnvelope = {
  status: boolean;
  message: string;
  data: VerifyPinResult;
};

export const auth = createApi({
  reducerPath: "auth",
  baseQuery: axiosBaseQuery(),
  endpoints: builder => ({
    verifyPin: builder.mutation<VerifyPinResult, string>({
      query: pin => ({
        url: "/auth/pin/verify",
        method: "POST",
        data: { pin },
      }),
      transformResponse: (response: VerifyPinEnvelope) => response.data,
    }),
  }),
});

export const { useVerifyPinMutation } = auth;
