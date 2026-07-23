import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type DocumentType = "passport" | "national-id";

export type Country = {
  alpha2Code: string;
  label: string;
};

type KycState = {
  documentType: DocumentType;
  country: Country;
};

const initialState: KycState = {
  documentType: "passport",
  country: {
    alpha2Code: "NG",
    label: "Nigeria",
  },
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    setDocumentType(state, action: PayloadAction<DocumentType>) {
      state.documentType = action.payload;
    },

    setCountry(state, action: PayloadAction<Country>) {
      state.country = action.payload;
    },

    resetKyc: () => initialState,
  },
});

export const { setDocumentType, setCountry, resetKyc } = kycSlice.actions;

export default kycSlice.reducer;
