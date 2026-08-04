import { ChevronRight, User2Icon } from "lucide-react";
import { useState } from "react";
import { MdArrowBack, MdPhoneAndroid } from "react-icons/md";
import { useNavigate } from "react-router";
import { trackEvent } from "@/utils/trackEvent";

export default function SendMoney() {
  const [isDisabled, setIsDisabled] = useState(true);
  const navigate = useNavigate();

  const handleDisabled = () => {
    setIsDisabled(true);
  };

  return (
    <section className="py-[25px] px-screen-x">
      <div className="space-y-[2rem]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="inline-block font-rh-m">
            Send money
          </span>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-2">
          <span className="inline-block uppercase text-[16px] font-rh-m text-sfx-muted">
            Choose a method
          </span>

          <div className="w-full space-y-2.5 md:space-y-4">
            <button
              onClick={() => {
                trackEvent("send_money_started", { method: "sfx_user" });
                navigate("/sendmoney/sfxs");
              }}
              className="w-full p-(--spacing-card-pad) bg-sfx-card rounded-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="shrink-0 flex size-14 items-center justify-center rounded-2xl bg-sfx-primary-tint sm:size-16">
                    <User2Icon className="size-6 text-sfx-primary sm:size-8" />
                  </div>
                  <div className="space-y-1 text-left">
                    <h3 className="font-rh-b text-[16px] leading-[16px]">
                      SFx User
                    </h3>
                    <p className="text-[14px] leading-[13px] md:text-[15px] md:leading-[18px] text-sfx-muted ">
                      Instant and free, with a username or
                      {" "}
                      <br className="hidden md:block" />
                      QR code.
                    </p>
                  </div>
                </div>

                <ChevronRight className="shrink-0 size-5 md:size-6 text-sfx-muted" />
              </div>
            </button>
            <button
              onClick={() => {
                navigate("/withdraw/address");
              }}
              className="w-full p-(--spacing-card-pad) bg-sfx-card rounded-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="shrink-0 flex size-14 items-center justify-center rounded-2xl bg-sfx-success-bg sm:size-16">
                    <User2Icon className="size-6 text-sfx-success sm:size-8" />
                  </div>

                  <div className="space-y-1 text-left">
                    <h3 className="font-rh-b text-[16px] leading-[16px]">
                      Crypto wallet
                    </h3>

                    <p className="text-[14px] leading-[13px] md:text-[15px] md:leading-[18px] text-sfx-muted">
                      Send USDC to any address on
                      {" "}
                      <br className="hidden md:block" />
                      Polygon Amoy.
                    </p>
                  </div>
                </div>

                <ChevronRight className="shrink-0 size-5 md:size-6 text-sfx-muted" />
              </div>
            </button>
            <button
              disabled={isDisabled}
              onClick={handleDisabled}
              className={`w-full p-(--spacing-card-pad) bg-sfx-card rounded-card ${
                isDisabled
                  ? "opacity-70 cursor-not-allowed!"
                  : "opacity-100 cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="shrink-0 flex size-14 items-center justify-center rounded-2xl bg-sfx-amber-bg sm:size-16">
                    <User2Icon className="size-6 text-sfx-amber sm:size-8" />
                  </div>

                  <div className="space-y-1 text-left">
                    <h3 className="font-rh-b text-[16px] leading-[16px]">
                      Local bank
                      {" "}
                      <span className="inline-block px-2 py-1 rounded-full bg-sfx-amber-bg text-[14px] font-rh-m text-sfx-amber">
                        Coming soon
                      </span>
                    </h3>

                    <p className="text-[14px] leading-[13px] md:text-[15px] md:leading-[18px] text-sfx-muted">
                      Fund from a local bank account.
                    </p>
                  </div>
                </div>

                <ChevronRight className="shrink-0 size-5 md:size-6 text-sfx-muted" />
              </div>
            </button>
            <button
              disabled={isDisabled}
              onClick={handleDisabled}
              className={`w-full p-(--spacing-card-pad) bg-sfx-card rounded-card ${
                isDisabled
                  ? "opacity-70 cursor-not-allowed!"
                  : "opacity-100 cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="shrink-0 flex size-14 items-center justify-center rounded-2xl bg-sfx-danger-bg sm:size-16">
                    <MdPhoneAndroid className="size-6 text-sfx-danger sm:size-8" />
                  </div>

                  <div className="space-y-1 text-left">
                    <h3 className="font-rh-b text-[16px] leading-[16px]">
                      Mobile money
                      {" "}
                      <span className="inline-block px-2 py-1 rounded-full bg-sfx-amber-bg text-[14px] font-rh-m text-sfx-amber">
                        Coming soon
                      </span>
                    </h3>

                    <p className="text-[14px] leading-[13px] md:text-[15px] md:leading-[18px] text-sfx-muted">
                      Fund from a mobile money wallet.
                    </p>
                  </div>
                </div>

                <ChevronRight className="shrink-0 size-5 md:size-6 text-sfx-muted" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
