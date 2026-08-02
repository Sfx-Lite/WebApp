import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type SendMoneyState = {
  recipientUsername: string | null;
  recipientDisplayName: string | null;
  note: string;
  amount: string;
};

const initialState: SendMoneyState = {
  recipientUsername: null,
  recipientDisplayName: null,
  note: "",
  amount: "",
};

const sendMoneySlice = createSlice({
  name: "sendMoney",
  initialState,
  reducers: {
    setRecipient(state, action: PayloadAction<{ username: string; displayName: string }>) {
      state.recipientUsername = action.payload.username;
      state.recipientDisplayName = action.payload.displayName;
    },
    setNote(state, action: PayloadAction<string>) {
      state.note = action.payload;
    },
    setAmount(state, action: PayloadAction<string>) {
      state.amount = action.payload;
    },
    resetSendMoney() {
      return initialState;
    },
  },
});

export const { setRecipient, setNote, setAmount, resetSendMoney } = sendMoneySlice.actions;
export default sendMoneySlice.reducer;
