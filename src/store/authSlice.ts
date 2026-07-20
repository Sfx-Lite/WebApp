import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthPayload, AuthState, User } from "@/lib/types/auth";
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
  isPinVerified: sessionStorage.getItem("pinVerified") === "true",
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

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
    },
    pinVerified(state) {
      state.isPinVerified = true;
      sessionStorage.setItem("pinVerified", "true");
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isPinVerified = false;

      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () => {
        window.history.pushState(null, "", window.location.href);
      });

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("pinVerified");
    },
  },
});

export const { credentialsSet, pinVerified, logout } = authSlice.actions;
export default authSlice.reducer;
