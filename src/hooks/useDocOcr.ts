import { useState } from "react";
import { createWorker } from "tesseract.js";

export type OcrData = {
  documentNumber?: string;
  fullName?: string;
  rawText: string;
};

export function useDocOcr() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);

  const processDocument = async (imageSrc: string): Promise<OcrData | null> => {
    setIsProcessing(true);
    setOcrProgress(0);

    try {
      // 1. Initialize Tesseract English worker
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(imageSrc);
      await worker.terminate();

      const rawText = data.text;

      const passportNumMatch = rawText.match(/[A-Z0-9]{8,9}/);

      return {
        rawText,
        documentNumber: passportNumMatch ? passportNumMatch[0] : undefined,
      };
    }
    catch (err) {
      console.error("OCR Processing Error:", err);
      return null;
    }
    finally {
      setIsProcessing(false);
    }
  };

  const uploadDocumentApi = async (file: File | Blob, extractedData?: OcrData | null) => {
    const formData = new FormData();
    formData.append("document", file);
    if (extractedData) {
      formData.append("ocrData", JSON.stringify(extractedData));
    }

    // Place actual backend endpoint (like this, axios.post('/api/kyc/doc', formData))
    // console.log("Uploading payload to backend API...", { file, extractedData });

    return new Promise(resolve => setTimeout(resolve, 800)); // Simulated network latency
  };

  return {
    processDocument,
    uploadDocumentApi,
    isProcessing,
    ocrProgress,
  };
}
