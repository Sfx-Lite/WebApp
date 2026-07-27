import { useState } from "react";
import { AiOutlineScan, AiOutlineUser } from "react-icons/ai";
import { MdArrowBack, MdClose, MdPictureAsPdf } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import api from "@/api/axios";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/reduxHooks";
import { trackEvent } from "@/utils/trackEvent";

const KYC_SUBMISSION_URL = "/kyc/submission";

export default function KycReviewSubmit() {
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const {
    documentType,
    documentImage,
    documentFile,
    selfieImage,
    selfieFile,
    isPdf,
  } = useAppSelector(state => state.kyc);

  const canSubmit
    = !!documentType
      && !!documentFile
      && !!selfieFile;

  const cards = [
    {
      id: 1,
      title:
        documentType === "passport"
          ? "International Passport"
          : "National ID Card",
      subtitle: "Review your uploaded document.",
      image: documentImage,
      isPdf,
      route: "/kyc/doc",
      Icon: AiOutlineScan,
    },
    {
      id: 2,
      title: "Selfie",
      subtitle: "Ensure your face is clearly visible.",
      image: selfieImage,
      isPdf: false,
      route: "/kyc/selfie",
      Icon: AiOutlineUser,
    },
  ];

  const handleSubmit = async () => {
    if (!documentFile || !selfieFile) {
      toast.error("Please upload all required documents.");
      return;
    }

    const formData = new FormData();

    formData.append("docType", documentType);
    formData.append("doc", documentFile);
    formData.append("selfie", selfieFile);

    try {
      await api.post(KYC_SUBMISSION_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      trackEvent("kyc_submitted");
      toast.success("KYC submitted successfully.");

      navigate("/kyc/pending");
    }
    catch (error) {
      console.error(error);
      toast.error("Failed to submit KYC.");
    }
  };

  const handleView = (image: string | null, title: string) => {
    if (!image) {
      return;
    }

    setPreviewImage(image);
    setPreviewTitle(title);
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-sfx-primary-tint">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-2">
            <Link
              to="/kyc/selfie"
              className="rounded-lg p-1 transition hover:bg-sfx-primary/10"
            >
              <MdArrowBack className="size-6 text-sfx-ink" />
            </Link>

            <h1 className="font-rh-sb text-xl text-sfx-ink sm:text-2xl">
              Review & Submit
            </h1>
          </div>

          <p className="mt-2 font-rh-r text-sm text-sfx-muted">
            Review your uploaded document and selfie before submitting them for
            verification.
          </p>
        </header>

        <div className="flex-1 space-y-5">
          {cards.map(card => (
            <div
              key={card.id}
              className="
                flex
                flex-col
                gap-5
                rounded-3xl
                border
                border-sfx-primary-tint/20
                bg-white
                p-5
                shadow-sm

                md:flex-row
                md:items-center
              "
            >
              {/* For user to preview */}
              <div className="flex w-full flex-col items-center md:w-52 md:shrink-0">
                <div
                  className="
                    h-52
                    w-full
                    overflow-hidden
                    rounded-2xl
                    bg-sfx-primary-soft/20

                    md:h-36
                  "
                >
                  {card.image
                    ? (
                        card.isPdf
                          ? (
                              <div className="flex h-full flex-col items-center justify-center gap-2">
                                <MdPictureAsPdf className="size-16 text-red-500" />
                                <span className="font-rh-sb text-sm">PDF Document</span>
                              </div>
                            )
                          : (
                              <img
                                src={card.image}
                                alt={card.title}
                                className="h-full w-full object-cover"
                              />
                            )
                      )
                    : (
                        <div className="flex h-full items-center justify-center">
                          <card.Icon className="size-14 text-sfx-primary" />
                        </div>
                      )}
                </div>

                <div className="mt-3 flex w-full gap-2">
                  <Button
                    variant="outline"
                    disabled={!card.image}
                    onClick={() => handleView(card.image, card.title)}
                    className="
                      flex-1
                      rounded-full
                      border-sfx-primary
                      font-rh-sb
                      text-sfx-primary
                    "
                  >
                    View
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate(card.route)}
                    className="
                      flex-1
                      rounded-full
                      border-sfx-primary
                      font-rh-sb
                      text-sfx-primary
                    "
                  >
                    Retake
                  </Button>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-center">
                <h2 className="font-rh-sb text-lg text-sfx-ink">
                  {card.title}
                </h2>

                <p className="mt-2 font-rh-r text-sm leading-relaxed text-sfx-muted">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}

          <div className="rounded-3xl bg-white p-5 shadow-brand">
            <p className="font-rh-r text-sm leading-relaxed text-sfx-muted">
              By submitting these documents, you confirm that they belong to you
              and that the information provided is accurate. Verification
              typically completes within
              {" "}
              <strong className="text-sfx-ink">24 hours.</strong>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="
              h-button-h
              w-full
              rounded-button
              bg-sfx-primary
              font-rh-sb
              text-base
              text-white
              shadow-brand
              hover:bg-sfx-ink/90
            "
          >
            Submit for Review
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {/* Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6"
          onClick={() => setPreviewImage(null)} // Close when clicking backdrop
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl bg-white p-4 sm:p-6 shadow-2xl"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking content
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-sfx-primary-tint/20 pb-3">
              <h2 className="font-rh-sb text-lg text-sfx-ink sm:text-xl">
                {previewTitle}
              </h2>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="rounded-full bg-sfx-primary-tint/30 p-2 text-sfx-ink transition-colors hover:bg-sfx-primary-tint/60"
              >
                <MdClose className="size-5" />
              </button>
            </div>

            {/* Full Document View Container */}
            <div className="relative flex flex-1 items-center justify-center overflow-auto rounded-2xl bg-[#13111C] p-2 sm:p-4">
              {isPdf && previewTitle.includes("Passport")
                ? (
                    <iframe
                      src={previewImage}
                      title={previewTitle}
                      className="h-full w-full"
                    />
                  )
                : (
                    <img
                      src={previewImage}
                      alt={previewTitle}
                      className="max-h-[70vh] w-full"
                    />
                  )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
