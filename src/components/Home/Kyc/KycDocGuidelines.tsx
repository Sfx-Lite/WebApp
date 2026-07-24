import { MdFlipCameraIos } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { TIPS } from "@/utils/kyc";

type Props = {
  maxFileSize: number;
  onContinue: () => void;
  disabled: boolean;
};

export default function KycDocGuidelines({
  maxFileSize,
  onContinue,
  disabled,
}: Props) {
  return (
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
          {maxFileSize}
          {" "}
          MB).
        </p>

        <div className="space-y-4">
          {TIPS.map((tip, index) => (
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
          onClick={onContinue}
          disabled={disabled}
          className="h-button-h w-full rounded-button bg-sfx-primary font-rh-sb text-base text-white shadow-brand hover:bg-sfx-ink/90 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
