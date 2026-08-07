import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

import { logout, tokensRefreshed } from "../store/authSlice";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let queue: QueuedRequest[] = [];

function processQueue(error: unknown, token: string | null) {
  queue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error);
    }
    else {
      resolve(token);
    }
  });
  queue = [];
}

instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const { store } = await import("../store");
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (
      error.response?.status !== 401
      || !originalRequest
      || originalRequest._retry
      || originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    const { store } = await import("../store");
    const refreshToken = store.getState().auth.refreshToken;

    if (!refreshToken) {
      store.dispatch(logout());
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (newToken: string) => {
            originalRequest._retry = true;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(instance(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await refreshClient.post("/auth/refresh", { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data?.data ?? {};

      if (!accessToken || !newRefreshToken) {
        throw new Error("Malformed refresh response");
      }

      store.dispatch(tokensRefreshed({ accessToken, refreshToken: newRefreshToken }));
      processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return instance(originalRequest);
    }
    catch (refreshError) {
      processQueue(refreshError, null);
      store.dispatch(logout());
      return Promise.reject(refreshError);
    }
    finally {
      isRefreshing = false;
    }
  },
);

export default instance;
