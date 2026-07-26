import { Eye, EyeOff, Plus, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetWalletBalanceQuery } from "@/api/wallet";

export default function WalletBalance() {
  const { data, isLoading, isError } = useGetWalletBalanceQuery();
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  const balanceDisplay = isLoading
    ? "…"
    : isError
      ? "--"
      : `$${Number(data?.balance).toFixed(2)}`;

  return (
    <div className="w-full md:w-1/2 p-card-pad rounded-card space-y-[.75rem] bg-sfx-card shadow-lg">
      <div className="flex items-center gap-2">
        <p className="text-[14px] text-sfx-muted">
          Main account balance
        </p>

        <button onClick={() => setIsVisible(prev => !prev)}>
          {isVisible
            ? (
                <Eye className="w-[18px] text-sfx-muted" />
              )
            : (
                <EyeOff className="w-[18px] text-sfx-muted" />
              )}
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-end gap-0.5">
          <h1 className="text-[36px] leading-[36px] font-rh-sb">
            {isVisible ? balanceDisplay : "••••••"}
          </h1>
          <span className="uppercase tracking-tight text-sfx-muted">
            {data?.asset ?? "USDC"}
          </span>
        </div>
        <div className="flex items-end gap-0.5">
          <span className="text-[15px] text-sfx-muted font-rh-sb">
            {isVisible ? `≈ ${balanceDisplay}` : "≈ ••••••"}
          </span>
          <span className="text-[15px] text-sfx-muted">
            USD
          </span>
          <span className="text-[15px] text-sfx-muted">
            ·
            {" "}
            {data?.network ?? "Polygon Amoy"}
          </span>
        </div>
        {isLoading && (
          <p className="text-[13px] text-sfx-muted">
            Fetching balance…
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/addmoney")}
          className="w-1/2 py-[12px] px-[25px] flex items-center justify-center gap-1 rounded-full bg-sfx-primary hover:scale-95 transition-transform duration-300"
        >
          <Plus className="w-[20px] text-white" />
          <span className="text-white font-rh-m">
            Add
          </span>
        </button>
        <button
          className="w-1/2 py-[12px] px-[25px] flex items-center justify-center gap-1 rounded-full bg-sfx-card border border-sfx-primary hover:scale-95 transition-transform duration-300"
        >
          <Send className="w-[20px] text-sfx-primary" />
          <span className="text-sfx-primary font-rh-m">
            Send
          </span>
        </button>
      </div>
    </div>
  );
}
