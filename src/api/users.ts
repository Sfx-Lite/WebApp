import type { UserProfileData } from "@/lib/types/user";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

type UserProfileEnvelope = {
  status: boolean;
  message: string;
  data: UserProfileData;
};

export type UsernameAvailability = {
  username: string;
  available: boolean;
  profileImage: string | null;
};

type UsernameAvailabilityEnvelope = {
  status: boolean;
  message: string;
  data: UsernameAvailability;
};

export const users = createApi({
  reducerPath: "users",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["UserProfile"],
  endpoints: builder => ({
    getUserProfile: builder.query<UserProfileData, void>({
      query: () => ({ url: "/users/profile", method: "GET" }),
      transformResponse: (response: UserProfileEnvelope) => response.data,
      providesTags: ["UserProfile"],
    }),
    checkUsername: builder.query<UsernameAvailability, string>({
      query: username => ({ url: `/users/search/${username}`, method: "GET" }),
      transformResponse: (response: UsernameAvailabilityEnvelope) => response.data,
    }),
  }),
});

export const { useGetUserProfileQuery, useCheckUsernameQuery, useLazyCheckUsernameQuery } = users;
