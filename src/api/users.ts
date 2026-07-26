import type { UserProfileData } from "@/lib/types/user";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

type UserProfileEnvelope = {
  status: boolean;
  message: string;
  data: UserProfileData;
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
  }),
});

export const { useGetUserProfileQuery } = users;
