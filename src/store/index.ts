import { configureStore } from "@reduxjs/toolkit";
import { notifications } from "@/api/notifications";
import { transactions } from "@/api/transactions";
import { users } from "@/api/users";
import { wallet } from "@/api/wallet";
import authReducer from "./authSlice";
import kycReducer from "./kycSlice";
import topbarReducer from "./topbarSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topBar: topbarReducer,
    kyc: kycReducer,
    [wallet.reducerPath]: wallet.reducer,
    [transactions.reducerPath]: transactions.reducer,
    [users.reducerPath]: users.reducer,
    [notifications.reducerPath]: notifications.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(
    wallet.middleware,
    transactions.middleware,
    users.middleware,
    notifications.middleware,
  ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
