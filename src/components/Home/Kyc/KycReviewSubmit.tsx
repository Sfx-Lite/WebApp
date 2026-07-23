import { AiOutlineScan, AiOutlineUser } from "react-icons/ai";
import { MdArrowBack } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/reduxHooks";

const STEPS = [
  {
    id: 1,
    Icon: AiOutlineScan,
    title: "Passport",
    actionText: "Retake",
    route: "/kyc/doc",
  },
  {
    id: 2,
    Icon: AiOutlineUser,
    title: "Selfie",
    actionText: "Retake",
    route: "/kyc/selfie",
  },
];

export default function KycReviewSubmit() {
  const documentType = useAppSelector(state => state.kyc.documentType);

  const navigate = useNavigate();

  return (
    <div className="flex p-4 flex-col justify-between h-screen w-full bg-sfx-primary-tint">
      <div className="flex-1">
        <header className="py-4 mt-6">
          <div className="flex items-center gap-2">
            <Link to="/kyc/selfie">
              <MdArrowBack className="size-6" />
            </Link>

            <h1 className="font-rh-sb text-xl">Review & Submit</h1>
          </div>
        </header>

        <ol className="mt-6 flex gap-4">
          {STEPS.map(({ id, Icon, title, actionText, route }) => (
            <li
              key={id}
              className="flex-1 bg-white p-3 rounded-3xl border border-sfx-primary-tint/20 shadow-sm flex flex-col items-center text-center gap-3"
            >
              <div className="w-full h-24 rounded-2xl bg-sfx-primary-soft/30 text-sfx-primary flex items-center justify-center">
                <Icon className="size-8 text-sfx-primary-strong" />
              </div>

              <div className="flex flex-col items-center gap-1">
                <p className="text-m font-rh-b ">
                  {" "}
                  {id === 1
                    ? documentType === "passport"
                      ? "International Passport"
                      : "National ID Card"
                    : title}
                </p>
                <button
                  type="button"
                  onClick={() => navigate(route)}
                  className="text-sm font-rh-b text-sfx-primary hover:text-xs hover:text-sfx-ink"
                >
                  {actionText}
                </button>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-start gap-2 rounded-2xl shadow-brand bg-white p-3">
          <p className="text-sm font-rh-r text-sfx-muted p-1">
            By submitting you confirm the document belongs to you and the
            details on your profile match it. Review usually completes within
            {" "}
            <strong className="text-sfx-ink">24 hours.</strong>
          </p>
        </div>
      </div>

      <div>
        <Button
          onClick={() => navigate("/kyc/pending")}
          className="
              w-full
              h-(--spacing-button-h)
              rounded-button
              bg-sfx-primary
              text-white
              hover:bg-sfx-ink/90
              text-base
              font-rh-sb
              shadow-brand
              "
        >
          Submit for review
        </Button>
      </div>
    </div>
  );
}
