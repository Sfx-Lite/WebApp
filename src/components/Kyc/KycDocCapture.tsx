import { useEffect, useState } from "react";
import {
  MdArrowBack,
  MdCheck,
  MdFlipCameraIos,
  MdPictureAsPdf,
  MdUploadFile,
} from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/reduxHooks";

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
  const documentType = useAppSelector(state => state.kyc.documentType);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);

  // Clean up Object URL to prevent memory leaks when image changes or unmounts
  useEffect(() => {
    return () => {
      if (capturedImage?.startsWith("blob:")) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  const handleCapture = () => {
    setIsPdf(false);
    // Demo placeholder capture logic
    setCapturedImage(
      "https://placehold.co/600x400/1e1b2e/ffffff?text=Document+Captured",
    );
  };

  const handleRetake = () => {
    if (capturedImage?.startsWith("blob:")) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setIsPdf(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file)
      return;

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.warning("Unsupported file type. Please upload a JPG, PNG, WEBP, or PDF.");
      e.target.value = "";
      return;
    }

    // Validate size (8 MB limit)
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.warning(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
      e.target.value = "";
      return;
    }

    if (capturedImage?.startsWith("blob:")) {
      URL.revokeObjectURL(capturedImage);
    }

    const isPdfFile = file.type === "application/pdf";
    const imageUrl = URL.createObjectURL(file);

    setIsPdf(isPdfFile);
    setCapturedImage(imageUrl);

    e.target.value = "";
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
                    <div className="relative flex aspect-[4/3] w-full max-w-sm items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400/80 bg-emerald-500/5 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                      <span className="rounded-lg border border-emerald-500/20 bg-[#13111C]/90 px-3 py-1.5 text-center font-rh-sb text-xs text-emerald-400 backdrop-blur-sm">
                        Fit the photo page inside
                      </span>
                    </div>
                  )}
            </div>

            {/* Checklist items */}
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
                        onClick={() => navigate("/kyc/selfie")}
                        className="flex-1 rounded-full bg-sfx-primary font-rh-sb text-white hover:bg-sfx-primary/90"
                      >
                        Use Photo
                      </Button>
                    </div>
                  )
                : (
                    <div className="flex items-center justify-between px-2 sm:px-6">
                      {/* Upload file button */}
                      <label className="flex cursor-grab lg:mx-auto items-center gap-1.5 text-xs text-white/80 transition-colors hover:text-white">
                        <MdUploadFile className="size-5" />
                        <span>Upload file</span>
                        <input
                          type="file"
                          accept={ALLOWED_TYPES.join(",")}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Shutter Capture Button */}
                      <button
                        type="button"
                        onClick={handleCapture}
                        className="flex size-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-105 active:scale-90 lg:hidden"
                        aria-label="Capture document"
                      >
                        <div className="size-14 rounded-full border-2 border-[#13111C]" />
                      </button>

                      {/* Flip camera button */}
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-xs text-white/80 transition-colors hover:text-white lg:hidden"
                      >
                        <MdFlipCameraIos className="size-5" />
                        <span>Flip camera</span>
                      </button>
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

            {/* Desktop View */}
            <div className="pt-6">
              <Button
                onClick={() => navigate("/kyc/selfie")}
                disabled={!capturedImage}
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
