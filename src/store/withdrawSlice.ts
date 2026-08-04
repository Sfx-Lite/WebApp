import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type WithdrawState = {
  externalAddress: string | null;
  amount: string;
  note: string;
};

const initialState: WithdrawState = {
  externalAddress: null,
  amount: "",
  note: "",
};

const withdrawSlice = createSlice({
  name: "withdraw",
  initialState,
  reducers: {
    setExternalAddress(state, action: PayloadAction<string>) {
      state.externalAddress = action.payload;
    },
    setWithdrawAmount(state, action: PayloadAction<string>) {
      state.amount = action.payload;
    },
    setWithdrawNote(state, action: PayloadAction<string>) {
      state.note = action.payload;
    },
    resetWithdraw() {
      return initialState;
    },
  },
});

export const { setExternalAddress, setWithdrawAmount, setWithdrawNote, resetWithdraw } = withdrawSlice.actions;
export default withdrawSlice.reducer;
