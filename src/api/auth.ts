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

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
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
    requestPasswordReset: builder.mutation<null, ForgotPasswordPayload>({
      query: payload => ({
        url: "/auth/forgot_password",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response: { status: boolean; message: string; data: null }) => response.data,
    }),
    resetPassword: builder.mutation<null, ResetPasswordPayload>({
      query: ({ token, newPassword }) => ({
        url: `/auth/reset_password/${token}`,
        method: "POST",
        data: { newPassword },
      }),
      transformResponse: (response: { status: boolean; message: string; data: null }) => response.data,
    }),
  }),
});

export const {
  useVerifyPinMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = auth;
