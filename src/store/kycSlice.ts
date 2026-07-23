import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type DocumentType = "passport" | "national-id";

export type Country = {
  alpha2Code: string;
  label: string;
};

export type OcrData = {
  documentNumber?: string;
  fullName?: string;
  rawText?: string;
};

type KycState = {
  documentType: DocumentType;
  country: Country;
  documentImage: string | null; // Blob URL or base64 string
  selfieImage: string | null; // Blob URL or base64 string
  isPdf: boolean;
  ocrData: OcrData | null;
};

const initialState: KycState = {
  documentType: "passport",
  country: {
    alpha2Code: "NG",
    label: "Nigeria",
  },
  documentImage: null,
  selfieImage: null,
  isPdf: false,
  ocrData: null,
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

    setDocumentData(
      state,
      action: PayloadAction<{ image: string; isPdf?: boolean; ocrData?: OcrData | null }>,
    ) {
      state.documentImage = action.payload.image;
      state.isPdf = action.payload.isPdf ?? false;
      if (action.payload.ocrData !== undefined) {
        state.ocrData = action.payload.ocrData;
      }
    },

    setSelfieImage(state, action: PayloadAction<string>) {
      state.selfieImage = action.payload;
    },

    resetKyc: () => initialState,
  },
});

export const {
  setDocumentType,
  setCountry,
  setDocumentData,
  setSelfieImage,
  resetKyc,
} = kycSlice.actions;

export default kycSlice.reducer;
