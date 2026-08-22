import type { RootState } from "@/store";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { AiOutlineScan, AiOutlineUser } from "react-icons/ai";
import {
  MdArrowBack,
  MdCheckCircle,
  MdInfoOutline,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setDocumentType } from "@/store/kycSlice";

type DocumentId = "passport" | "national_id";

const Docs: {
  id: DocumentId;
  Icon: typeof AiOutlineScan;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    id: "passport",
    Icon: AiOutlineScan,
    title: "International Passport",
    description: "Photo page with machine-readable zone visible.",
    iconBg: "bg-sfx-primary-tint",
    iconColor: "text-sfx-primary",
  },
  {
    id: "national_id",
    Icon: AiOutlineUser,
    title: "National ID Card",
    description: "Front side, all corners visible.",
    iconBg: "bg-sfx-success-bg",
    iconColor: "text-sfx-success",
  },
];

function CountryFlag({
  alpha2Code,
  label,
}: {
  alpha2Code: string;
  label: string;
}) {
  return (
    <ReactCountryFlag
      countryCode={alpha2Code}
      svg
      style={{
        width: "1.25rem",
        height: "1.25rem",
      }}
      aria-label={label}
    />
  );
}

export default function KycType() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<DocumentId>("passport");

  const country = useSelector(
    (state: RootState) => state.kyc.country,
  );

  const handleContinue = () => {
    dispatch(setDocumentType(selected));
    navigate("/kyc/doc");
  };

  return (
    <div className="mx-auto flex h-screen w-full max-w-md flex-col overflow-hidden">
      <header className="shrink-0 pt-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/kyc")}
            className="flex size-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition-colors hover:bg-slate-50"
            aria-label="Back"
          >
            <MdArrowBack className="size-5 text-sfx-ink" />
          </button>

          <h1 className="font-rh-sb text-lg text-sfx-ink">
            Choose your document
          </h1>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col pt-7 pb-7">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-rh-m text-xs uppercase text-sfx-muted">
                Issued in
              </span>

              <CountryFlag
                alpha2Code={country.alpha2Code}
                label={country.label}
              />

              <span className="font-rh-m text-xs text-sfx-muted">
                {country.label}
              </span>
            </div>

            <button
              type="button"
              className="font-rh-m text-xs text-sfx-primary-strong underline"
            >
              Change
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {Docs.map(
              ({
                id,
                Icon,
                title,
                description,
                iconBg,
                iconColor,
              }) => {
                const isSelected = selected === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelected(id)}
                    className={`w-full rounded-xl border bg-white p-3 text-left shadow-brand transition-all ${
                      isSelected
                        ? "border-sfx-primary ring-2 ring-sfx-primary/20"
                        : "border-sfx-primary-tint/20 hover:border-sfx-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                        >
                          <Icon
                            className={`size-6 ${iconColor}`}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-rh-b text-sm leading-tight text-sfx-ink">
                            {title}
                          </h3>

                          <p className="mt-1 font-rh-r text-[10px] leading-relaxed text-sfx-muted">
                            {description}
                          </p>
                        </div>
                      </div>

                      {isSelected
                        ? (
                            <MdCheckCircle className="size-5 shrink-0 text-sfx-primary-strong" />
                          )
                        : (
                            <div className="size-5 shrink-0 rounded-full border border-sfx-ink/50" />
                          )}
                    </div>
                  </button>
                );
              },
            )}
          </div>

          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-sfx-primary-tint/20 bg-white p-3 shadow-sm">
            <MdInfoOutline className="mt-0.5 size-5 shrink-0 text-sfx-primary" />

            <p className="font-rh-r text-xs leading-relaxed text-sfx-muted">
              Make sure your document is
              {" "}
              <strong className="font-rh-b text-sfx-ink">
                valid and not expired.
              </strong>
              {" "}
              Blurry or cropped photos are the most common rejection reason.
            </p>
          </div>
        </div>

        <div className="mt-auto px-2 pb-10 pt-6 sm:px-0 sm:pb-6">
          <button
            type="button"
            onClick={handleContinue}
            className="h-12 w-full rounded-full bg-sfx-primary text-sm font-rh-sb text-white shadow-brand button__hover"
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}
