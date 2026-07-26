import { MdOutlineShield } from "react-icons/md";

import { useNavigate } from "react-router";

export default function VerifyIdentity() {
  const navigate = useNavigate();

  return (
    <div className="p-(--spacing-card-pad) bg-sfx-card rounded-card border-2 border-sfx-primary-soft flex gap-4">
      <div className="">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-sfx-primary/5 sm:size-16">
          <MdOutlineShield className="size-7 text-sfx-primary sm:size-8" />
        </div>
      </div>
      <div className="flex flex-1 gap-4 flex-col md:flex-row md:items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-rh-b text-[16px] leading-[16px]">
            Verify your Identity
          </h3>
          <p className="text-[15px] leading-[18px] text-sfx-muted ">
            Sending and withdrawals unlock once you're verified.
            {" "}
            <br />
            It takes about 2 minutes.
          </p>
        </div>

        <button
          onClick={() => navigate("/kyc")}
          className="w-fit bg-sfx-primary py-3 px-8 rounded-full text-white hover:scale-95 transition-transform duration-300"
        >
          Start Verification
        </button>
      </div>
    </div>
  );
}
