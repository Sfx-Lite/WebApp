import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import topbarReducer from "./topbarSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topBar: topbarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
