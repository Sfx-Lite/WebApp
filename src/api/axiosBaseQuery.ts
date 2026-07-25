import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError } from "axios";
import instance from "./axios";

export function axiosBaseQuery(): BaseQueryFn<
  {
    url: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    data?: unknown;
    params?: unknown;
  },
  unknown,
  { status?: number; data?: unknown }
> {
  return async ({ url, method = "GET", data, params }) => {
    try {
      const result = await instance({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    }
    catch (error) {
      const err = error as AxiosError;

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
        },
      };
    }
  };
}
