import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

import { logout } from "../store/authSlice";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

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
    if (error.response?.status === 401) {
      const { store } = await import("../store");
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export default instance;
