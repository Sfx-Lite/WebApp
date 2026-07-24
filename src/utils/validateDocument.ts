import { ALLOWED_TYPES, MAX_FILE_SIZE_MB } from "./kyc";

export function validateDocument(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Unsupported file type. Please upload a JPG, PNG, WEBP, or PDF.";
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`;
  }

  return null;
}
