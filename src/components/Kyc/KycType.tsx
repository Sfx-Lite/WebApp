import type { RootState } from "@/store";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { AiOutlineScan, AiOutlineUser } from "react-icons/ai";
import { MdArrowBack, MdCheckCircle, MdInfoOutline } from "react-icons/md";
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

function CountryFlag({ alpha2Code, label }: { alpha2Code: string; label: string }) {
  return (
    <ReactCountryFlag
      countryCode={alpha2Code}
      svg
      style={{ width: "1.25rem", height: "1.25rem" }}
      aria-label={label}
    />
  );
}

export default function KycType() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<DocumentId>("passport");
  const country = useSelector((state: RootState) => state.kyc.country);

  const handleContinue = () => {
    dispatch(setDocumentType(selected));
    navigate("/kyc/doc");
  };

  return (
    <section className="py-[25px] px-screen-x">
      <div className="space-y-[2rem]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/kyc")}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="inline-block font-rh-m">
            Choose your document
          </span>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-block uppercase text-[16px] font-rh-m text-sfx-muted">
              Issued in
              {" "}
              <CountryFlag alpha2Code={country.alpha2Code} label={country.label} />
              {" "}
              {country.label}
            </span>

            <button className="text-[15px] font-rh-m text-sfx-primary-strong underline">
              Change
            </button>
          </div>

          <p className="text-[15px] leading-[18px] text-sfx-muted">
            Select an official identity document issued by the government.
          </p>

          <div className="w-full space-y-4 pt-2">
            {Docs.map(({ id, Icon, title, description, iconBg, iconColor }) => {
              const isSelected = selected === id;

              return (
                <button
                  key={id}
                  onClick={() => setSelected(id)}
                  className={`w-full p-(--spacing-card-pad) bg-sfx-card rounded-card transition-colors ${
                    isSelected ? "ring-2 ring-sfx-primary-strong" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex size-14 items-center justify-center rounded-2xl sm:size-16 ${iconBg}`}
                      >
                        <Icon className={`size-6 sm:size-8 ${iconColor}`} />
                      </div>
                      <div className="space-y-1 text-left">
                        <h3 className="font-rh-b text-[16px] leading-[16px]">
                          {title}
                        </h3>
                        <p className="text-[15px] leading-[18px] text-sfx-muted">
                          {description}
                        </p>
                      </div>
                    </div>

                    {isSelected
                      ? (
                          <MdCheckCircle className="size-6 shrink-0 text-sfx-primary-strong" />
                        )
                      : (
                          <div className="size-6 shrink-0 rounded-full border border-sfx-ink" />
                        )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-card bg-sfx-card p-(--spacing-card-pad)">
            <MdInfoOutline className="size-5 shrink-0 text-sfx-primary mt-0.5" />
            <p className="text-[13px] leading-relaxed text-sfx-muted">
              Make sure your document is
              {" "}
              <strong className="font-rh-b text-sfx-ink">valid and not expired.</strong>
              {" "}
              Blurry or cropped photos are the most common rejection reason.
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="h-button-h rounded-button w-full bg-sfx-primary text-base font-rh-sb text-white shadow-brand button__hover mt-[35px]"
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
