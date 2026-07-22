import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthPayload, AuthState, User } from "../lib/types/auth";
import { createSlice } from "@reduxjs/toolkit";

function loadUser(): User | null {
  const raw = localStorage.getItem("user");
  if (!raw)
    return null;
  try {
    return JSON.parse(raw);
  }
  catch {
    return null;
  }
}

const initialState: AuthState = {
  user: loadUser(),
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  hasPin: sessionStorage.getItem("hasPin") === "true",
  isInitialized: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    credentialsSet(state, action: PayloadAction<AuthPayload>) {
      const { accessToken, refreshToken, user } = action.payload;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.hasPin = false;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.removeItem("hasPin");
    },
    pinStatusSet(state, action: PayloadAction<boolean>) {
      state.hasPin = action.payload;

      if (action.payload) {
        sessionStorage.setItem("hasPin", "true");
      }
      else {
        sessionStorage.removeItem("hasPin");
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.hasPin = false;

      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () => {
        window.history.pushState(null, "", window.location.href);
      });

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("hasPin");
    },
  },
});

export const { credentialsSet, pinStatusSet, logout } = authSlice.actions;
export default authSlice.reducer;
