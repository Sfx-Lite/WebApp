import { MdArrowBack, MdOutlineShield } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/utils/trackEvent";

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

export default function KycIntro() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex h-screen w-full max-w-md flex-col overflow-hidden">

      <header className="shrink-0 pt-1">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex size-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition-colors hover:bg-slate-50"
            aria-label="Back"
          >
            <MdArrowBack className="size-5 text-sfx-ink" />
          </Link>

          <h1 className="font-rh-sb text-lg text-sfx-ink">
            Verify your identity
          </h1>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col pt-7 pb-7">
        <div>
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-sfx-primary/5">
            <MdOutlineShield className="size-7 text-sfx-primary" />
          </div>

          <h2 className="font-rh-b text-xl leading-tight text-sfx-ink">
            Two quick steps to unlock sending
          </h2>

          <p className="mt-2 text-[11px] leading-relaxed text-sfx-muted">
            We verify every account to keep SFx Lite safe. Your documents are
            stored privately and reviewed by our team.
          </p>

          <ol className="mt-4 space-y-2">
            {STEPS.map(step => (
              <li
                key={step.id}
                className="flex items-start gap-3 rounded-xl border border-sfx-primary-tint/20 bg-white p-3 shadow-brand"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sfx-primary-tint font-rh-b text-xs text-sfx-primary">
                  {step.id}
                </div>

                <div className="min-w-0 pt-0.5">
                  <p className="font-rh-sb text-sm leading-tight text-sfx-ink">
                    {step.title}
                  </p>

                  <p className="mt-0.5 font-rh-r text-xs leading-relaxed text-sfx-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="font-rh-r text-sm leading-tight text-sfx-danger">
              Training environment — use the provided sample documents, never
              a real ID.
            </p>
          </div>
        </div>

        <div className="mt-auto px-2 pb-10 sm:px-0 sm:pb-6">
          {" "}
          <Button
            onClick={() => {
              trackEvent("kyc_submission_started");
              navigate("/kyc/type");
            }}
            className="h-12 w-full rounded-full bg-sfx-primary text-sm font-rh-sb text-white shadow-brand button__hover"
          >
            Get started
          </Button>
        </div>
      </main>
    </div>
  );
}
