import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type DocumentType = "passport" | "national_id";

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

  // For displaying preview
  documentImage: string | null;
  selfieImage: string | null;

  // For API upload to the backend
  documentFile: File | null;
  selfieFile: File | null;

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

  documentFile: null,
  selfieFile: null,

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
      action: PayloadAction<{ image: string; file: File; isPdf?: boolean; ocrData?: OcrData | null }>,
    ) {
      state.documentImage = action.payload.image;
      state.documentFile = action.payload.file;
      state.isPdf = action.payload.isPdf ?? false;
      if (action.payload.ocrData !== undefined) {
        state.ocrData = action.payload.ocrData;
      }
    },

    setSelfieImage(
      state,
      action: PayloadAction<{
        image: string;
        file: File;
      }>,
    ) {
      state.selfieImage = action.payload.image;
      state.selfieFile = action.payload.file;
    },

    clearSelfie: (state) => {
      state.selfieImage = null;
      state.selfieFile = null;
    },

    clearDocument: (state) => {
      state.documentImage = null;
      state.documentFile = null;
      state.isPdf = false;
      state.ocrData = null;
    },
    resetKyc: () => initialState,

  },
});

export const {
  setDocumentType,
  setCountry,
  setDocumentData,
  setSelfieImage,
  clearSelfie,
  clearDocument,
  resetKyc,
} = kycSlice.actions;

export default kycSlice.reducer;
