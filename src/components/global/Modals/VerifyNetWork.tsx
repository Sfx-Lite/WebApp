/* eslint-disable react/set-state-in-effect */
import { AlertTriangle, Check } from "lucide-react";
import { useEffect, useState } from "react";
import DefaultModal from "./DefaultModal";

type VerifyNetworkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  network: string;
  estimatedArrival?: string;
};

export default function VerifyNetworkModal({
  isOpen,
  onClose,
  onContinue,
  network,
  estimatedArrival = "~1 minute",
}: VerifyNetworkModalProps) {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (isOpen)
      setVerified(false);
  }, [isOpen]);

  const handleContinue = () => {
    if (!verified)
      return;
    onContinue();
  };

  return (
    <DefaultModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center pb-6">
        <div className="flex size-16 items-center justify-center rounded-full bg-sfx-danger-bg mb-3">
          <AlertTriangle className="size-7 text-sfx-danger" />
        </div>
        <h2 className="font-rh-b text-[20px] text-sfx-ink">Verify network</h2>
      </div>

      <div className="space-y-3 pb-4">
        <div className="flex items-center justify-between pb-3 border-b border-dashed border-sfx-muted/25">
          <span className="text-[14px] text-sfx-muted">Network</span>
          <span className="font-rh-b text-[14px] uppercase text-sfx-ink">{network}</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-dashed border-sfx-muted/25">
          <span className="text-[14px] text-sfx-muted">Estimated arrival</span>
          <span className="font-rh-b text-[14px] text-sfx-ink">{estimatedArrival}</span>
        </div>
      </div>

      <p className="text-center text-[14px] leading-[19px] text-sfx-danger pb-5">
        Sending on the wrong network will result in permanent loss of funds.
      </p>

      <button
        type="button"
        onClick={() => setVerified(v => !v)}
        className={`w-full flex items-center gap-3 p-4 rounded-2xl mb-6 transition-colors ${
          verified ? "bg-sfx-primary-tint" : "bg-sfx-card"
        }`}
      >
        <span
          className={`flex size-6 shrink-0 items-center justify-center rounded-full transition-colors ${
            verified ? "bg-sfx-primary" : "bg-white border border-sfx-muted/30"
          }`}
        >
          {verified && <Check className="size-3.5 text-white" strokeWidth={3} />}
        </span>
        <span className="text-[14px] text-sfx-ink text-left">
          I&apos;ve verified the network is correct
        </span>
      </button>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!verified}
        className={`w-full py-4 rounded-button bg-sfx-primary font-rh-m text-[15px] text-white transition-opacity ${
          verified ? "opacity-100 cursor-pointer" : "opacity-40 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </DefaultModal>
  );
}
