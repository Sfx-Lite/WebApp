import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import kycReducer from "./kycSlice";
import topbarReducer from "./topbarSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topBar: topbarReducer,
    kyc: kycReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
