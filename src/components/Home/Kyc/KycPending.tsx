import { GoClock } from "react-icons/go";
import { MdCheckCircleOutline, MdInfoOutline } from "react-icons/md";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/reduxHooks";

const Doc_Labels: Record<string, string> = {
  "passport": "International passport",
  "national-id": "National ID Card",
};

const Guidelines = [
  {
    title: "Instant Access",
    desc: "You can continue receiving funds and using standard wallet features while we verify your identity.",
  },
  {
    title: "Review Timeline",
    desc: "Verification usually takes less than 24 hours. You'll receive a push notification once complete.",
  },
  {
    title: "Need Updates?",
    desc: "If any document requires resubmission, we will email you directly with clear instructions.",
  },
];

export default function KycPending() {
  const navigate = useNavigate();
  const documentType = useAppSelector(state => state.kyc.documentType);

  const documentLabel
    = (Doc_Labels[documentType]);

  const details = [
    { label: "Status", value: "Pending review", isStatus: true },
    { label: "Submitted", value: "Today, 3:22 pm" },
    { label: "Document", value: documentLabel },
  ];

  return (
    <div className="flex h-dvh w-full flex-col overflow-y-auto bg-sfx-primary-tint">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-between p-4 sm:p-6 lg:max-w-5xl lg:p-8">
        <div className=" grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex min-h-fit flex-col justify-between items-center rounded-3xl border border-sfx-primary-tint/30 bg-white/70 p-6 shadow-sm sm:p-8 lg:h-full">
            <div className="my-auto flex w-full flex-col items-center text-center">
              <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-amber-100 ring-8 ring-amber-50/50">
                <GoClock className="size-9 text-amber-600" />
              </div>

              <h1 className="mb-2 font-rh-sb text-xl text-sfx-ink sm:text-2xl">
                Documents submitted
              </h1>

              <p className="mb-8 max-w-sm font-rh-r text-sm leading-relaxed text-sfx-muted">
                Our team is reviewing your identity. We'll notify you — usually
                within 24 hours. You can keep receiving money in the meantime.
              </p>

              <div className="w-full rounded-2xl bg-white p-4 shadow-brand sm:p-5">
                {details.map(({ label, value, isStatus }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-dashed border-gray-100 py-3 first:pt-0 last:border-0 last:pb-0"
                  >
                    <p className="font-rh-r text-xs text-sfx-muted sm:text-sm">
                      {label}
                    </p>
                    {isStatus
                      ? (
                          <span className="rounded-full bg-amber-100 px-3 py-1 font-rh-sb text-xs text-amber-600">
                            {value}
                          </span>
                        )
                      : (
                          <p className="font-rh-sb text-xs text-sfx-ink sm:text-sm">
                            {value}
                          </p>
                        )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile / Primary Action Button */}
            <div className="mt-8 w-full">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="h-button-h rounded-button w-full border-sfx-primary bg-transparent font-rh-sb text-base text-sfx-primary shadow-brand hover:bg-sfx-primary hover:text-white"
              >
                Back to home
              </Button>
            </div>
          </div>

          <div className="hidden h-full flex-col justify-between rounded-3xl border border-sfx-primary-tint/30 bg-white/70 p-6 shadow-sm lg:flex lg:p-8">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <MdInfoOutline className="size-5 text-sfx-primary" />
                <h2 className="font-rh-b text-base text-sfx-ink">
                  What happens next?
                </h2>
              </div>

              <p className="mb-6 font-rh-r text-sm leading-relaxed text-sfx-muted">
                Your submitted details are being securely processed by our
                compliance team.
              </p>

              <div className="space-y-4">
                {Guidelines.map(item => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-2xl border border-sfx-primary-tint/20 bg-white p-4 shadow-sm"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sfx-primary-tint/60 text-sfx-primary">
                      <MdCheckCircleOutline className="size-5" />
                    </div>
                    <div>
                      <p className="font-rh-b text-xs text-sfx-ink sm:text-sm">
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-rh-r text-xs leading-relaxed text-sfx-muted">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="rounded-2xl border border-sfx-primary-tint/20 bg-sfx-primary-tint/30 p-4 text-center">
                <p className="font-rh-r text-xs text-sfx-muted">
                  Questions about verification?
                  {" "}
                  <button
                    type="button"
                    onClick={() => navigate("/support")}
                    className="font-rh-sb text-sfx-primary hover:underline"
                  >
                    Contact Support
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
