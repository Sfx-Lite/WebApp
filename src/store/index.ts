import { configureStore } from "@reduxjs/toolkit";
import { beneficiaries } from "@/api/beneficiaries";
import { fees } from "@/api/fee";
import { notifications } from "@/api/notifications";
import { transactions } from "@/api/transactions";
import { users } from "@/api/users";
import { wallet } from "@/api/wallet";
import { withdrawals } from "@/api/withdrawal";
import authReducer from "./authSlice";
import kycReducer from "./kycSlice";
import sendMoneyReducer from "./sendMoneySlice";
import topbarReducer from "./topbarSlice";
import withdrawReducer from "./withdrawSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topBar: topbarReducer,
    kyc: kycReducer,
    sendMoney: sendMoneyReducer,
    withdraw: withdrawReducer,
    [wallet.reducerPath]: wallet.reducer,
    [transactions.reducerPath]: transactions.reducer,
    [users.reducerPath]: users.reducer,
    [notifications.reducerPath]: notifications.reducer,
    [beneficiaries.reducerPath]: beneficiaries.reducer,
    [fees.reducerPath]: fees.reducer,
    [withdrawals.reducerPath]: withdrawals.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(
    wallet.middleware,
    transactions.middleware,
    users.middleware,
    notifications.middleware,
    beneficiaries.middleware,
    fees.middleware,
    withdrawals.middleware,
  ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
