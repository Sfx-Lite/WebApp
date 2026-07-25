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
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { setDocumentType } from "@/store/kycSlice";

const Docs = [
  {
    id: "passport",
    Icon: AiOutlineScan,
    title: "International Passport",
    description: "Photo page with machine-readable zone visible.",
  },
  {
    id: "national-id",
    Icon: AiOutlineUser,
    title: "National ID Card",
    description: "Front side, all corners visible.",
  },
] as const;

function CountryFlag({ alpha2Code, label }: { alpha2Code: string; label: string }) {
  return (
    <ReactCountryFlag
      countryCode={alpha2Code}
      svg
      style={{ width: "1.5rem", height: "1.5rem" }}
      aria-label={label}
    />
  );
}

export default function KycType() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<"passport" | "national-id"> ("passport");
  const country = useSelector((state: RootState) => state.kyc.country);
  const handleContinue = () => {
    dispatch(setDocumentType(selected));
    navigate("/kyc/doc");
  };

  return (
    <div className="flex h-dvh w-full flex-col bg-sfx-primary-tint overflow-hidden">
      <div className="mx-auto flex w-full max-w-4xl lg:max-w-5xl flex-1 flex-col justify-between p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="py-2 mb-4">
          <div className="flex items-center gap-2">
            <Link
              to="/kyc"
              className="rounded-lg p-1 transition-colors hover:bg-sfx-primary/10"
            >
              <MdArrowBack className="size-6 text-sfx-ink" />
            </Link>

            <h1 className="font-rh-sb text-lg sm:text-xl text-sfx-ink">
              Choose your document
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 flex-1 items-start overflow-hidden">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="font-rh-sb px-3">
                <span className="mr-2 ">Issued in</span>
                <CountryFlag
                  alpha2Code={country.alpha2Code}
                  label={country.label}
                />
                {" "}

                <span>
                  {country.label}
                </span>

                <button className="ml-3 underline text-sfx-primary-strong ">
                  Change
                </button>
              </div>

              <p className="mt-3 text-sm text-sfx-muted leading-relaxed">
                Select an official identity document issued by the government.
              </p>

              {/* Document Options */}
              <ol className="mt-4 space-y-3">
                {Docs.map(({ id, Icon, title, description }) => {
                  const isSelected = selected === id;

                  return (
                    <li
                      key={id}
                      onClick={() => setSelected(id)}
                      className={`cursor-pointer bg-white p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? "border-sfx-primary-strong ring-1 ring-sfx-primary-strong shadow-md"
                          : "border-sfx-primary-tint/20 shadow-brand hover:border-sfx-primary-tint"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`size-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-sfx-primary-strong text-white"
                              : "bg-sfx-primary-tint text-sfx-primary-strong"
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>

                        <div>
                          <p className="text-sm font-rh-b text-sfx-ink">
                            {title}
                          </p>
                          <p className="text-xs font-rh-r text-sfx-muted">
                            {description}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSelected
                          ? (
                              <MdCheckCircle className="size-6 text-sfx-primary-strong" />
                            )
                          : (
                              <div className="size-6 rounded-full border border-sfx-ink" />
                            )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-sfx-primary-tint/20 bg-white/90 p-3.5 shadow-brand">
                <MdInfoOutline className="size-5 shrink-0 text-sfx-primary mt-0.5" />
                <p className="text-xs font-rh-r text-sfx-muted leading-relaxed">
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

            {/* Action Button */}
            <div className="pt-4 pb-2 mt-auto">
              <Button
                onClick={handleContinue}
                className="h-button-h rounded-button w-full bg-sfx-primary text-base font-rh-sb text-white shadow-brand hover:bg-sfx-ink/90"
              >
                Continue
              </Button>
            </div>
          </div>

          {/* COLUMN 2: Guidelines Sidebar */}
          <div className="hidden lg:flex">
            <p> Progress bar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
