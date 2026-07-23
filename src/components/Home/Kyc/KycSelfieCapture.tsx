import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";
import { MdArrowBack, MdCheck, MdFlipCameraIos } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Guide = ["Good lighting", "No hat or glasses", "Just you"];

const Tips = [
  {
    title: "Positioning",
    desc: "Make sure your entire face fits comfortably within the oval guide.",
  },
  {
    title: "Lighting",
    desc: "Avoid direct backlighting or dark shadows over your eyes and face.",
  },
  {
    title: "Expression",
    desc: "Keep a neutral facial expression and look directly at the camera.",
  },
];

const videoConstraints = {
  facingMode: "user",
};

export default function KycSelfieCapture() {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Position your face inside the frame",
  );

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        // console.log("✅ Face model loaded");
        setModelsLoaded(true);
      }
      catch (error) {
        console.error("❌ Failed to load model", error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded)
      return;

    const interval = setInterval(async () => {
      if (!webcamRef.current?.video)
        return;

      const result = await faceapi.detectAllFaces(
        webcamRef.current.video,
        new faceapi.TinyFaceDetectorOptions(),
      );

      if (result.length === 1) {
        setFaceDetected(true);
        setStatusMessage("Face detected");
      }
      else if (result.length === 0) {
        setFaceDetected(false);
        setStatusMessage("No face detected");
      }
      else {
        setFaceDetected(false);
        setStatusMessage("Only one person should be visible");
      }
    }, 200);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  const handleCapture = async () => {
    if (!modelsLoaded) {
      toast.warning("Face detector is loading...");
      return;
    }
    if (!webcamRef.current)
      return;

    const video = webcamRef.current.video;

    if (!video)
      return;

    const detection = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions(),
    );

    if (detection) {
      const imageSrc = webcamRef.current.getScreenshot();

      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
    else {
      toast.warning("Please position your face inside the frame");
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="flex h-dvh w-full flex-col bg-sfx-primary-tint overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl lg:max-w-5xl flex-1 flex-col justify-between p-4 sm:p-6 lg:p-8">
        <header className="py-2 mb-4">
          <div className="flex items-center gap-2">
            <Link
              to="/kyc/doc"
              className="rounded-lg p-1 transition-colors hover:bg-sfx-primary/10"
            >
              <MdArrowBack className="size-6 text-sfx-ink" />
            </Link>

            <h1 className="font-rh-sb text-lg sm:text-xl text-sfx-ink">
              Take a selfie
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 flex-1 items-stretch">
          <div className="flex flex-col justify-between rounded-3xl bg-[#13111C] p-5 text-white shadow-xl min-h-[480px]">
            <div className="relative flex flex-1 flex-col items-center justify-center rounded-2xl bg-[#1E1B2E] p-6 border border-white/10">
              {capturedImage
                ? (
                    <img
                      src={capturedImage}
                      alt="Captured Selfie"
                      className="h-full w-full object-cover rounded-xl"
                    />
                  )
                : (
                    <>
                      <div className="relative flex-1 w-full overflow-hidden rounded-xl">
                        <Webcam
                          ref={webcamRef}
                          mirrored
                          audio={false}
                          screenshotFormat="image/jpeg"
                          videoConstraints={videoConstraints}
                          className="
                          absolute
                          inset-0
                          h-full
                          w-full
                          object-cover
                          rounded-2xl
                        "
                        />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="
                            w-55
                            aspect-3/4
                            rounded-[50%]
                            border-2
                            border-dashed
                            border-red-400
                          "
                          />
                        </div>
                      </div>

                      <p
                        className={`absolute bottom-4 text-sm font-rh-b tracking-wide text-center ${
                          faceDetected
                            ? "text-emerald-400"
                            : "text-sfx-danger"
                        }`}
                      >
                        {statusMessage}
                      </p>
                    </>
                  )}
            </div>

            <div className="my-4 flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-xs text-white/80 font-rh-r">
              {Guide.map(item => (
                <span key={item} className="flex items-center gap-1">
                  <MdCheck className="size-4 text-emerald-400" />
                  {item}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-center pt-1">
              {capturedImage
                ? (
                    <div className="flex gap-3 w-full">
                      <Button
                        onClick={handleRetake}
                        variant="outline"
                        className="flex-1 border-white/20 text-white bg-white/10 hover:bg-white/20 rounded-full"
                      >
                        Retake
                      </Button>
                      <Button
                        onClick={() => navigate("/kyc/submit")}
                        className="flex-1 bg-sfx-primary text-white hover:bg-sfx-primary/90 rounded-full font-rh-sb"
                      >
                        Use Photo
                      </Button>
                    </div>
                  )
                : (
                    <div className="grid grid-cols-3 items-center w-full px-2 sm:px-6">
                      <div />

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={handleCapture}
                          disabled={!faceDetected}
                          className={`
                          flex size-16 items-center justify-center rounded-full shadow-lg transition-transform
                          ${faceDetected
                      ? "bg-emerald-400 hover:scale-105"
                      : "bg-gray-400 opacity-50"}
`}
                          aria-label="Capture photo"
                        >
                          <div className="size-14 rounded-full border-2 border-[#13111C]" />
                        </button>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="flex flex-col items-center gap-1 text-center text-xs text-white/80 transition-colors hover:text-white lg:hidden "
                        >
                          <MdFlipCameraIos className="size-6 text-white/90" />
                          <span className="leading-tight">Flip camera</span>
                        </button>
                      </div>
                    </div>
                  )}
            </div>
          </div>

          <div className="flex-col justify-between rounded-2xl border border-sfx-primary-tint/30 bg-white/70 p-6 shadow-sm hidden lg:flex">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MdFlipCameraIos className="size-5 text-sfx-primary" />
                <h3 className="font-rh-b text-base text-sfx-ink">
                  Selfie Guide
                </h3>
              </div>

              <p className="font-rh-r text-sm text-sfx-muted leading-relaxed mb-6">
                We use this photo to match your face with the document you
                submitted. The oval guide helps ensure high image accuracy for
                instant verification.
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
                      <p className="font-rh-b text-xs sm:text-sm text-sfx-ink">
                        {tip.title}
                      </p>
                      <p className="font-rh-r text-xs text-sfx-muted mt-0.5">
                        {tip.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Action Backup */}
            <div className="pt-6 hidden lg:block">
              <Button
                onClick={() => navigate("/kyc/submit")}
                disabled={!capturedImage}
                className="h-button-h rounded-button w-full bg-sfx-primary text-base font-rh-sb text-white shadow-brand hover:bg-sfx-ink/90 disabled:opacity-50"
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
