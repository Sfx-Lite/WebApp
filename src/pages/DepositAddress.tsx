import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useLocation, useNavigate } from "react-router";
import { useGetWalletAddressQuery } from "@/api/wallet";
import QrCode from "@/components/global/qrcode/QrCode";
import { trackEvent } from "@/utils/trackEvent";

type DepositAddressState = {
  assetSymbol?: string;
  networkLabel?: string;
};

function truncateMiddle(value: string, start = 8, end = 6): string {
  if (value.length <= start + end)
    return value;
  return `${value.slice(0, start)}…${value.slice(-end)}`;
}

export default function DepositAddress() {
  const navigate = useNavigate();
  const location = useLocation();

  const { assetSymbol = "USDC", networkLabel = "Polygon Amoy" }
    = (location.state as DepositAddressState) || {};

  const { data, isLoading, isError } = useGetWalletAddressQuery();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackEvent("deposit_address_viewed");
  }, []);

  const handleCopy = async () => {
    if (isLoading || !data?.depositAddress)
      return;
    try {
      await navigator.clipboard.writeText(data.depositAddress);
      setCopied(true);
      trackEvent("deposit_address_copied");
      setTimeout(setCopied, 1800, false);
    }
    catch {

    }
  };

  return (
    <section className="py-[25px] px-screen-x pb-[110px]">
      <div className="space-y-[2rem]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="inline-block font-rh-m">Your deposit address</span>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-6">
          <div className="p-(--spacing-card-pad) bg-white rounded-card space-y-4">
            <div className="w-full aspect-square max-w-[220px] mx-auto">
              {isLoading
                ? <div className="w-full h-full rounded-[10px] bg-sfx-muted/20 animate-pulse" />
                : <QrCode value={data?.depositAddress ?? ""} />}
            </div>

            <div className="flex items-center justify-center gap-4 text-[14px]">
              <span>
                <span className="font-rh-b text-sfx-ink">Asset</span>
                {" "}
                <span className="text-sfx-muted">{data?.asset ?? assetSymbol}</span>
              </span>
              <span>
                <span className="font-rh-b text-sfx-ink">Network</span>
                {" "}
                <span className="text-sfx-muted">{data?.network ?? networkLabel}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[14px] text-sfx-muted">Wallet address</span>
            <button
              onClick={handleCopy}
              disabled={isLoading || isError}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border border-dashed border-sfx-primary/40 bg-sfx-primary-tint text-sfx-primary text-[14px] font-rh-m disabled:opacity-50"
            >
              <span className="truncate font-mono">
                {isLoading
                  ? "Loading address…"
                  : isError
                    ? "Couldn't load address"
                    : copied
                      ? "Copied!"
                      : truncateMiddle(data?.depositAddress ?? "")}
              </span>
              {!isLoading && (
                copied
                  ? <Check className="size-4 shrink-0" />
                  : <Copy className="size-4 shrink-0" />
              )}
            </button>
          </div>

          <div className="p-(--spacing-card-pad) rounded-card border border-sfx-danger/30 bg-sfx-danger-bg">
            <p className="text-[14px] leading-[19px] text-sfx-danger">
              Send only
              {" "}
              {data?.asset ?? assetSymbol}
              {" "}
              on
              {" "}
              {data?.network ?? networkLabel}
              {" "}
              to this address. Minimum 1
              {" "}
              {data?.asset ?? assetSymbol}
              . Other assets will be lost.
            </p>
          </div>
          <div className="px-screen-x py-[20px] bg-sfx-bg">
            <div className="w-full md:max-w-[50%] mx-auto">
              <button
                onClick={() => navigate("/")}
                className="w-full py-4 rounded-button bg-sfx-primary text-white font-rh-m text-[15px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
