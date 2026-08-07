import { AlertTriangle, DollarSign } from "lucide-react";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router";
import CustomSelect from "@/components/global/CustomSelect";
import VerifyNetworkModal from "@/components/global/Modals/VerifyNetWork";

type AssetOption = {
  id: string;
  symbol: string;
  name: string;
  rate: string;
};

type NetworkOption = {
  id: string;
  label: string;
};

const ASSET_OPTIONS: AssetOption[] = [
  { id: "usdc", symbol: "USDC", name: "USD Coin (USDC)", rate: "1 USDC ≈ 1 USD" },
];

const NETWORK_OPTIONS: NetworkOption[] = [
  { id: "polygon-amoy", label: "Polygon Amoy · testnet" },
];

export default function DepositCrypto() {
  const navigate = useNavigate();

  const [asset, setAsset] = useState<AssetOption>(ASSET_OPTIONS[0]);
  const [network, setNetwork] = useState<NetworkOption>(NETWORK_OPTIONS[0]);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const networkName = network.label.split(" ·")[0];

  const handleVerified = () => {
    setIsVerifyOpen(false);
    navigate("/addmoney/depositaddress", {
      state: { assetSymbol: asset.symbol, networkLabel: networkName },
    });
  };

  return (
    <section className="py-[25px] md:px-screen-x pb-[110px]">
      <div className="space-y-[2rem]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="inline-block font-rh-m">Deposit crypto</span>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-6">
          <div className="flex items-start gap-3 p-(--spacing-card-pad) rounded-card border-l-4 border-l-sfx-danger bg-sfx-danger-bg">
            <AlertTriangle className="size-5 text-sfx-danger shrink-0 mt-0.5" />
            <p className="text-[14px] leading-[19px] text-sfx-danger">
              You will receive USD in your
              {" "}
              {asset.symbol}
              {" "}
              (
              {networkName}
              ) account. Minimum deposit is 1
              {" "}
              {asset.symbol}
              .
            </p>
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[14px] text-sfx-muted">Asset</span>

            <CustomSelect<AssetOption>
              options={ASSET_OPTIONS}
              value={asset}
              onChange={setAsset}
              getKey={option => option.id}
              renderValue={option => (
                <>
                  <span className="flex size-9 items-center justify-center rounded-full bg-sfx-primary shrink-0">
                    <DollarSign className="size-5 text-white" />
                  </span>
                  <span className="flex items-baseline gap-2 min-w-0">
                    <span className="font-rh-b text-[16px] text-sfx-ink truncate">
                      {option.name}
                    </span>
                    <span className="text-[13px] text-sfx-muted shrink-0">{option.rate}</span>
                  </span>
                </>
              )}
              renderOption={option => (
                <>
                  <span className="text-[15px] text-sfx-ink">{option.name}</span>
                  <span className="text-[13px] text-sfx-muted">{option.rate}</span>
                </>
              )}
              placeholder="Select an asset"
            />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[14px] text-sfx-muted">Network</span>

            <CustomSelect<NetworkOption>
              options={NETWORK_OPTIONS}
              value={network}
              onChange={setNetwork}
              getKey={option => option.id}
              renderValue={option => (
                <span className="text-[16px] text-sfx-ink">{option.label}</span>
              )}
              renderOption={option => (
                <span className="text-[15px] text-sfx-ink">{option.label}</span>
              )}
              triggerClassName="bg-white"
              panelClassName="bg-white"
              placeholder="Select a network"
            />
          </div>

          <div className="p-(--spacing-card-pad) rounded-card bg-white">
            <p className="text-[14px] leading-[19px] text-sfx-muted">
              Deposits are credited after
              {" "}
              <span className="font-rh-b text-sfx-ink">3 confirmations</span>
              {" "}
              — usually under a minute. Sending any other asset to this address will
              result in loss of funds.
            </p>
          </div>
          <div className="px-screen-x py-[20px] bg-sfx-bg">
            <div className="w-full md:max-w-[50%] mx-auto">
              <button
                onClick={() => setIsVerifyOpen(true)}
                className="w-full py-4 rounded-button bg-sfx-primary text-white font-rh-m text-[15px]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <VerifyNetworkModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        onContinue={handleVerified}
        network={networkName}
      />
    </section>
  );
}
