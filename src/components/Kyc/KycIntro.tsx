import { useState } from "react";
import {
  MdArrowBack,
  MdExpandMore,
  MdHelpOutline,
  MdOutlineShield,
} from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    id: "1",
    title: "Photo of your ID",
    description: "International passport or national ID card.",
  },
  {
    id: "2",
    title: "A quick selfie",
    description: "So we can match your face to your document.",
  },
];

const FAQS = [
  {
    id: "faq-1",
    question: "What documents do I need to provide?",
    answer:
      "Typically, government-issued photo identification (e.g., Passport, National ID card, or Driver's License).",
  },
  {
    id: "faq-2",
    question: "Why do I need to take a selfie?",
    answer:
      "This is a biometric 'liveness' check. It matches your facial features with the photo on your ID to prevent identity fraud.",
  },
  {
    id: "faq-3",
    question: "What is a 'Proof of Address' document?",
    answer:
      "A utility bill (water, electricity), bank statement, or official government letter dated within the last 3 months confirming your residence.",
  },
  {
    id: "faq-4",
    question: "How long does verification take?",
    answer:
      "Automated systems verify data within minutes, while manual reviews typically take anywhere from a few hours to a day.",
  },
  {
    id: "faq-5",
    question: "Is my personal information safe?",
    answer:
      "Yes, your data is encrypted both in transit and at rest using bank-grade security and reviewed strictly for compliance purposes.",
  },
];

export default function KycIntro() {
  const navigate = useNavigate();
  // State to track which FAQ item is currently expanded (or null if all closed)
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div className="flex h-dvh w-full flex-col bg-sfx-primary-tint overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl lg:max-w-5xl flex-1 flex-col justify-between p-4 sm:p-6 lg:p-8">
        <header className="py-2 mb-4">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-lg p-1 transition-colors hover:bg-sfx-primary/10"
            >
              <MdArrowBack className="size-6 text-sfx-ink" />
            </Link>

            <h1 className="font-rh-sb text-lg sm:text-xl text-sfx-ink">
              Verify your identity
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 flex-1 items-start">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-sfx-primary/5 sm:size-16">
                <MdOutlineShield className="size-7 text-sfx-primary sm:size-8" />
              </div>

              <h2 className="mt-4 font-rh-b text-xl sm:text-2xl text-sfx-ink">
                Two quick steps to unlock sending
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                We verify every account to keep SFx Lite safe. Your documents
                are stored privately and reviewed by our team.
              </p>

              <ol className="mt-5 space-y-3">
                {STEPS.map(step => (
                  <li
                    key={step.id}
                    className="flex items-start gap-4 rounded-2xl border border-sfx-primary-tint/20 bg-white p-4 text-sfx-primary-strong shadow-brand"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sfx-primary-tint font-rh-b text-sm">
                      {step.id}
                    </div>
                    <div>
                      <p className="font-rh-b text-sm sm:text-base text-sfx-ink">
                        {step.title}
                      </p>
                      <p className="font-rh-r text-xs sm:text-sm text-sfx-muted">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-6 pb-2 mt-auto">
              <Button
                onClick={() => navigate("/kyc/type")}
                className="h-button-h rounded-button w-full bg-sfx-primary text-base font-rh-sb text-white shadow-brand hover:bg-sfx-ink/90"
              >
                Get started
              </Button>
            </div>
          </div>

          <div className="flex-col rounded-2xl border border-sfx-primary-tint/30 bg-white/70 p-5 shadow-sm hidden lg:flex">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-sfx-primary-tint/20">
              <MdHelpOutline className="size-5 text-sfx-primary" />
              <h3 className="font-rh-b text-base text-sfx-ink">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-2.5">
              {FAQS.map((faq) => {
                const isOpen = openFaqId === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-sfx-primary-tint/20 bg-white overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-center justify-between p-3.5 text-left transition-colors hover:bg-sfx-primary-tint/10"
                    >
                      <span className="font-rh-sb text-xs sm:text-sm text-sfx-ink pr-2">
                        {faq.question}
                      </span>
                      <MdExpandMore
                        className={`size-5 shrink-0 text-sfx-muted transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-sfx-primary" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-0">
                        <p className="font-rh-r text-xs leading-relaxed text-sfx-muted pt-1 border-t border-sfx-primary-tint/10">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
