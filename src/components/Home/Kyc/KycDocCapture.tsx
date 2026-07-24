import { useEffect, useRef, useState } from "react";
import {
  MdArrowBack,
  MdCheck,
  MdFlipCameraIos,
  MdPictureAsPdf,
  MdUploadFile,
} from "react-icons/md";
import { Link, useNavigate } from "react-router";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useDocOcr } from "@/hooks/useDocOcr";
import { setDocumentData } from "@/store/kycSlice";

const Guide = ["All four corners", "No glare", "Text readable"];
const MAX_FILE_SIZE_MB = 8;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const Tips = [
  {
    title: "Framing",
    desc: "Align your document so that all four corners fit inside the highlighted box.",
  },
  {
    title: "Clarity",
    desc: "Ensure good room lighting without harsh glare or reflections covering text.",
  },
  {
    title: "Legibility",
    desc: "Keep the camera steady so text and numbers remain sharp and easy to read.",
  },
];

export default function KycDocCapture() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const webcamRef = useRef<Webcam | null>(null);

  const documentType = useAppSelector(state => state.kyc.documentType);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment",
  );

  const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode,
  };
  const [extractedData, setExtractedData] = useState<any>(null);

  // Validation States
  const [docDetected, setDocDetected] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Fit document inside the frame",
  );

  const { processDocument, isProcessing, ocrProgress } = useDocOcr();

  // Real-time Frame Inspector (Runs every 300ms)
  useEffect(() => {
    if (capturedImage)
      return;

    const interval = setInterval(() => {
      if (!webcamRef.current?.video)
        return;

      const video = webcamRef.current.video;
      if (video.readyState !== 4)
        return;

      // Analyze contrast/edges inside target frame area
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");

      if (!ctx)
        return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Crop inspection to central guide box zone (60% width x 40% height)
      const cropWidth = canvas.width * 0.7;
      const cropHeight = canvas.height * 0.5;
      const cropX = (canvas.width - cropWidth) / 2;
      const cropY = (canvas.height - cropHeight) / 2;

      const frameData = ctx.getImageData(cropX, cropY, cropWidth, cropHeight);
      const data = frameData.data;

      let totalBrightness = 0;
      let edgeCount = 0;

      // Scan frame pixels for basic readability & edge contrast thresholds
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;
        totalBrightness += avg;

        // Neighbor edge comparison
        if (i + 16 < data.length) {
          const nextAvg = (data[i + 16] + data[i + 17] + data[i + 18]) / 3;
          if (Math.abs(avg - nextAvg) > 35) {
            edgeCount++;
          }
        }
      }

      const sampleCount = data.length / 16;
      const meanBrightness = totalBrightness / sampleCount;

      if (meanBrightness < 45) {
        setDocDetected(false);
        setStatusMessage("Lighting too dark — move to a brighter spot");
      }
      else if (meanBrightness > 225) {
        setDocDetected(false);
        setStatusMessage("Too much glare — adjust angle");
      }
      else if (edgeCount < sampleCount * 0.08) {
        setDocDetected(false);
        setStatusMessage("Position document card clearly in frame");
      }
      else {
        setDocDetected(true);
        setStatusMessage("Document aligned! Ready to capture");
      }
    }, 300);

    return () => clearInterval(interval);
  }, [capturedImage]);

  // Clean up Object URL
  useEffect(() => {
    return () => {
      if (capturedImage?.startsWith("blob:")) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  const handleDocumentProcess = async (
    imageUrl: string,
    isPdfFile: boolean,
  ) => {
    setCapturedImage(imageUrl);
    setIsPdf(isPdfFile);

    if (!isPdfFile) {
      const ocrResult = await processDocument(imageUrl);
      if (ocrResult) {
        setExtractedData(ocrResult);
        toast.success("Document text scanned successfully");
      }
    }
  };

  const handleCapture = () => {
    if (!docDetected) {
      toast.warning("Please position your document within the bounding guide");
      return;
    }

    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        handleDocumentProcess(imageSrc, false);
      }
      else {
        toast.error("Failed to capture image");
      }
    }
  };

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
    setDocDetected(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file)
      return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.warning("Unsupported format. Upload JPG, PNG, WEBP, or PDF.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.warning(`File size exceeds limit (${MAX_FILE_SIZE_MB}MB).`);
      e.target.value = "";
      return;
    }

    const isPdfFile = file.type === "application/pdf";
    const imageUrl = URL.createObjectURL(file);

    handleDocumentProcess(imageUrl, isPdfFile);
    e.target.value = "";
  };

  const handleContinue = () => {
    if (!capturedImage)
      return;

    dispatch(
      setDocumentData({
        image: capturedImage,
        isPdf,
        ocrData: extractedData,
      }),
    );

    navigate("/kyc/selfie");
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-y-auto bg-sfx-primary-tint">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-between p-4 sm:p-6 lg:max-w-5xl lg:p-8">
        <header className="mb-4 py-2">
          <div className="flex items-center gap-2">
            <Link
              to="/kyc/type"
              className="rounded-lg p-1 transition-colors hover:bg-sfx-primary/10"
            >
              <MdArrowBack className="size-6 text-sfx-ink" />
            </Link>

            <h1 className="font-rh-sb text-lg text-sfx-ink sm:text-xl">
              {documentType === "passport"
                ? "Capture Passport Photo page"
                : "Capture your National ID"}
            </h1>
          </div>
        </header>

        <div className="grid flex-1 items-stretch grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-1 h-full min-h-[480px] flex-col justify-between rounded-3xl bg-[#13111C] p-5 text-white shadow-xl">
            <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#1E1B2E] p-6">
              {isProcessing && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm p-4">
                  <div className="w-full max-w-xs bg-white/20 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                  <p className="font-rh-sb text-xs text-white">
                    Scanning details...
                    {" "}
                    {ocrProgress}
                    %
                  </p>
                </div>
              )}

              {capturedImage
                ? (
                    isPdf
                      ? (
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <MdPictureAsPdf className="size-16 text-red-400 mb-2" />
                            <span className="font-rh-sb text-sm text-white">
                              PDF Document Uploaded
                            </span>
                          </div>
                        )
                      : (
                          <img
                            src={capturedImage}
                            alt="Captured Document"
                            className="h-full w-full rounded-xl object-cover"
                          />
                        )
                  )
                : (
                    <>
                      {/* Add for testing in webcam -->onUserMedia={() => console.log("Camera started")}
                          onUserMediaError={error => console.log("Camera error:", error)}
                        */}
                      <div className="relative flex-1 w-full overflow-hidden rounded-xl">
                        <Webcam
                          ref={webcamRef}
                          mirrored={false}
                          audio={false}
                          screenshotFormat="image/jpeg"
                          videoConstraints={videoConstraints}
                          className="absolute inset-0 h-full w-full object-cover"
                        />

                        {/* Bounding Guide Box */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
                          <div
                            className={`w-full max-w-xs aspect-[3/2] rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center ${
                              docDetected
                                ? "border-emerald-400 bg-emerald-500/10 shadow-[0_0_25px_rgba(52,211,153,0.3)]"
                                : "border-red-400/80 bg-red-500/5"
                            }`}
                          >
                            <span
                              className={`rounded-lg border px-3 py-1.5 text-center font-rh-sb text-xs backdrop-blur-sm transition-colors ${
                                docDetected
                                  ? "border-emerald-500/30 bg-[#13111C]/90 text-emerald-400"
                                  : "border-red-500/30 bg-[#13111C]/90 text-red-400"
                              }`}
                            >
                              {statusMessage}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
            </div>

            <div className="my-4 flex flex-wrap items-center justify-center gap-3 text-xs font-rh-r text-white/80 sm:gap-4">
              {Guide.map(item => (
                <span key={item} className="flex items-center gap-1">
                  <MdCheck className="size-4 text-emerald-400" />
                  {item}
                </span>
              ))}
            </div>

            {/* Shutter & Controls */}
            <div className="pt-1">
              {capturedImage
                ? (
                    <div className="flex w-full gap-3">
                      <Button
                        onClick={handleRetake}
                        variant="outline"
                        className="flex-1 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                      >
                        Retake
                      </Button>
                      <Button
                        onClick={handleContinue}
                        disabled={isProcessing}
                        className="flex-1 rounded-full bg-sfx-primary font-rh-sb text-white hover:bg-sfx-primary/90 disabled:opacity-50"
                      >
                        Use Photo
                      </Button>
                    </div>
                  )
                : (
                    <div className="grid grid-cols-3 items-center w-full px-2 sm:px-6">
                      <label className="flex cursor-pointer items-center gap-1.5 text-xs text-white/80 transition-colors hover:text-white">
                        <MdUploadFile className="size-5" />
                        <span className="hidden sm:inline">Upload file</span>
                        <input
                          type="file"
                          accept={ALLOWED_TYPES.join(",")}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={handleCapture}
                          disabled={!docDetected || isProcessing}
                          className={`flex size-16 items-center justify-center rounded-full shadow-lg transition-all ${
                            docDetected
                              ? "bg-emerald-400 hover:scale-105 active:scale-95 cursor-pointer"
                              : "bg-gray-400 opacity-40 cursor-not-allowed"
                          }`}
                          aria-label="Capture document"
                        >
                          <div className="size-14 rounded-full border-2 border-[#13111C]" />
                        </button>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={toggleCamera}
                          className="flex items-center gap-1.5 text-xs text-white/80 transition-colors hover:text-white"
                        >
                          <MdFlipCameraIos className="size-5" />
                          <span className="hidden sm:inline">Flip camera</span>
                        </button>
                      </div>
                    </div>
                  )}
            </div>
          </div>

          <div className="flex-col justify-between rounded-2xl border border-sfx-primary-tint/30 bg-white/70 p-6 shadow-sm hidden lg:flex">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <MdFlipCameraIos className="size-5 text-sfx-primary" />
                <h2 className="font-rh-b text-base text-sfx-ink">
                  Document Guidelines
                </h2>
              </div>

              <p className="mb-6 font-rh-r text-sm leading-relaxed text-sfx-muted">
                Take a clear photo of your original document. Supported formats
                include JPG, PNG, WEBP, and PDF (up to
                {" "}
                {MAX_FILE_SIZE_MB}
                {" "}
                MB).
              </p>

              <div className="space-y-4">
                {Tips.map((tip, index) => (
                  <div
                    key={tip.title}
                    className="flex items-start gap-3 rounded-xl border border-sfx-primary-tint/20 bg-white p-3.5"
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sfx-primary-tint font-rh-b text-xs text-sfx-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-rh-b text-xs text-sfx-ink sm:text-sm">
                        {tip.title}
                      </p>
                      <p className="mt-0.5 font-rh-r text-xs text-sfx-muted">
                        {tip.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <Button
                onClick={handleContinue}
                disabled={!capturedImage || isProcessing}
                className="h-button-h w-full rounded-button bg-sfx-primary font-rh-sb text-base text-white shadow-brand hover:bg-sfx-ink/90 disabled:opacity-50"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
