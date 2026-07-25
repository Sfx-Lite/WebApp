import type Webcam from "react-webcam";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useDocOcr } from "@/hooks/useDocOcr";
import { setDocumentData } from "@/store/kycSlice";

const MAX_FILE_SIZE_MB = 8;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export function useDocCapture() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const webcamRef = useRef<Webcam>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [extractedData, setExtractedData] = useState<any>(null);

  const { processDocument, uploadDocumentApi, isProcessing, ocrProgress } = useDocOcr();

  useEffect(() => {
    return () => {
      if (capturedImage?.startsWith("blob:")) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  const handleImageSet = useCallback(async (imageUrl: string, isPdfFile: boolean) => {
    setCapturedImage(imageUrl);
    setIsPdf(isPdfFile);

    if (!isPdfFile) {
      const ocrResult = await processDocument(imageUrl);

      if (ocrResult) {
        setExtractedData(ocrResult);
        toast.success("Document text scanned successfully");
      }
    }
  }, [processDocument]);

  const handleCapture = useCallback(() => {
    if (!webcamRef.current)
      return;

    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      handleImageSet(imageSrc, false);
    }
    else {
      toast.error("Failed to capture image from camera");
    }
  }, [handleImageSet]);

  // Toggle front/back camera
  const toggleCamera = () => {
    setFacingMode(prev => (prev === "environment" ? "user" : "environment"));
  };

  const handleRetake = () => {
    if (capturedImage?.startsWith("blob:")) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setIsPdf(false);
    setExtractedData(null);
  };

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file)
        return;

      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.warning("Unsupported file type. Upload JPG, PNG, WEBP, or PDF.");
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.warning(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      const isPdfFile = file.type === "application/pdf";
      const imageUrl = URL.createObjectURL(file);

      handleImageSet(imageUrl, isPdfFile);

      e.target.value = "";
    },
    [handleImageSet],
  );

  const handleContinue = async () => {
    if (!capturedImage)
      return;

    try {
      const blob = await fetch(capturedImage).then(r => r.blob());
      await uploadDocumentApi(blob, extractedData);

      dispatch(
        setDocumentData({
          image: capturedImage,
          isPdf,
          ocrData: extractedData,
        }),
      );

      navigate("/kyc/selfie");
    }
    catch {
      toast.error("Failed to process document upload.");
    }
  };

  return {
    webcamRef,
    capturedImage,
    isPdf,
    facingMode,
    isProcessing,
    ocrProgress,
    ALLOWED_TYPES,
    MAX_FILE_SIZE_MB,
    handleCapture,
    toggleCamera,
    handleRetake,
    handleFileUpload,
    handleContinue,
  };
}
