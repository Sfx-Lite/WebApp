import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type TopBarState = {
  title: string;
};

const initialState: TopBarState = { title: "" };

const topBarSlice = createSlice({
  name: "topBar",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export const { setTitle } = topBarSlice.actions;
export default topBarSlice.reducer;
