import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import kycReducer from "./kycSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    kyc: kycReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
