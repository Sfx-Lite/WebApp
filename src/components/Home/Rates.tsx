import { ArrowUpDown, ChevronLeft, Info } from "lucide-react";
import { useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";

type RateEntry = {
  isoCode: string; // used to derive the flag emoji
  name: string;
  currency: string; // currency code, e.g. GBP
  add: number; // rate relative to USD
  send: number; // rate relative to USD
};

type RateType = "add" | "send";
type BaseCurrency = "USD" | "TRY";

// Values here are USD-based; TRY-based rates are derived below.
// mock values here
const RATES: RateEntry[] = [
  { isoCode: "GB", name: "Great Britain", currency: "GBP", add: 0.77, send: 0.73 },
  { isoCode: "EU", name: "European Union", currency: "EUR", add: 0.9, send: 0.86 },
  { isoCode: "TR", name: "Turkey", currency: "TRY", add: 47.91, send: 46.71 },
  { isoCode: "NG", name: "Nigeria", currency: "NGN", add: 1403.5, send: 1384.03 },
  { isoCode: "CM", name: "Cameroon", currency: "XAF", add: 615, send: 580 },
  { isoCode: "BW", name: "Botswana", currency: "BWP", add: 14.68, send: 13.81 },
  { isoCode: "RW", name: "Rwanda", currency: "RWF", add: 1495, send: 1420 },
  { isoCode: "KE", name: "Kenya", currency: "KES", add: 130.22, send: 128.66 },
  { isoCode: "GH", name: "Ghana", currency: "GHS", add: 14.13, send: 11.63 },
  { isoCode: "ZA", name: "South Africa", currency: "ZAR", add: 16.67, send: 16.37 },
  { isoCode: "GA", name: "Gabon", currency: "XAF", add: 615, send: 580 },
  { isoCode: "ZM", name: "Zambia", currency: "ZMW", add: 18.83, send: 17.83 },
];

function CountryFlag({ isoCode, label }: { isoCode: string; label?: string }) {
  return (
    <ReactCountryFlag
      countryCode={isoCode}
      svg
      style={{ width: "1.5rem", height: "1.5rem" }}
      aria-label={label ?? isoCode}
    />
  );
}

function formatNumber(value: number) {
  return Number.isInteger(value)
    ? value.toLocaleString()
    : value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

type Selection = { entry: RateEntry; type: RateType };

export default function Rates() {
  const [base, setBase] = useState<BaseCurrency>("USD");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [amount, setAmount] = useState("1");
  const [reversed, setReversed] = useState(false);

  const usdToTry = RATES.find(r => r.isoCode === "TR")!;

  const getRate = (entry: RateEntry, type: RateType) => {
    const usdRate = entry[type];
    if (base === "USD")
      return usdRate;

    return usdRate / usdToTry[type];
  };

  const handleRateClick = (entry: RateEntry, type: RateType) => {
    setSelection({ entry, type });
    setReversed(false);
    setAmount("1");
  };

  const rate = selection ? getRate(selection.entry, selection.type) : 0;

  const convertedAmount = useMemo(() => {
    const numericAmount = Number.parseFloat(amount) || 0;
    if (!selection)
      return 0;
    return reversed ? numericAmount / rate : numericAmount * rate;
  }, [amount, rate, reversed, selection]);

  const fromLabel = reversed ? selection?.entry.currency : base;
  const toLabel = reversed ? base : selection?.entry.currency;

  if (selection) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-6 space-y-6">
          <p className="text-center text-sfx-muted text-sm">Currency converter</p>

          <div className="relative">
            <div className="border-b border-sfx-muted/30 pb-3 flex items-baseline justify-center gap-2">
              <input
                type="number"
                min={0}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="text-[1.75rem] font-rh-sb bg-transparent outline-none w-32 text-center"
              />
              <span className="text-sm uppercase text-sfx-muted">{fromLabel}</span>
            </div>

            <div className="pt-3 flex items-baseline justify-center gap-2">
              <span className="text-[1.75rem] font-rh-sb">
                {formatNumber(convertedAmount)}
              </span>
              <span className="text-sm uppercase text-sfx-muted">{toLabel}</span>
            </div>

            <button
              type="button"
              onClick={() => setReversed(prev => !prev)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-sfx-muted hover:text-sfx-primary transition-colors"
              aria-label="Swap currencies"
            >
              <ArrowUpDown size={18} />
            </button>
          </div>

          <p className="text-center text-sm text-sfx-muted">
            Exchange rate: 1
            {" "}
            {base}
            {" "}
            =
            {" "}
            {formatNumber(rate)}
            {" "}
            {selection.entry.currency}
          </p>

          <div className="flex gap-2 items-start bg-sfx-primary/5 border-l-4 border-sfx-primary rounded-md p-3">
            <Info size={16} className="text-sfx-primary mt-0.5 shrink-0" />
            <p className="text-sm text-sfx-muted">
              Exchange rates shown are for informational purposes only.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSelection(null)}
          className="w-full mt-4 py-4 rounded-full bg-sfx-primary text-white font-rh-b hover:scale-95 transition-transform duration-300 flex items-center justify-center gap-2"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <p className="text-sfx-muted text-sm">Exchange rate</p>

        <div className="flex gap-3">
          {(["USD", "TRY"] as BaseCurrency[]).map(code => (
            <button
              key={code}
              type="button"
              onClick={() => setBase(code)}
              className={`flex-1 flex items-center justify-between gap-2 rounded-xl border px-4 py-3 transition-colors
                ${base === code ? "border-sfx-primary" : "border-sfx-muted/30"}`}
            >
              <span className="flex items-center gap-2 font-rh-sb">
                <CountryFlag isoCode={code === "USD" ? "US" : "TR"} />
                {code}
              </span>
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center
                  ${base === code ? "bg-sfx-primary" : "border border-sfx-muted/40"}`}
              >
                {base === code && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 text-sm font-rh-sb text-sfx-muted pt-2">
          <span />
          <span className="text-center w-18">Add</span>
          <span className="text-center w-18">Send</span>
        </div>

        <div className="divide-y divide-sfx-muted/10">
          {RATES.map(entry => (
            <div
              key={entry.isoCode}
              className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center py-3"
            >
              <span className="flex items-center gap-2 font-rh-sb">
                <CountryFlag isoCode={entry.isoCode} label={entry.name} />
                {entry.name}
              </span>

              <button
                type="button"
                onClick={() => handleRateClick(entry, "add")}
                className="min-w-18 rounded-lg border border-green-500 text-green-600 px-3 py-1.5 text-sm hover:bg-green-50 transition-colors"
              >
                {formatNumber(getRate(entry, "add"))}
              </button>

              <button
                type="button"
                onClick={() => handleRateClick(entry, "send")}
                className="min-w-18   rounded-lg border border-red-400 text-red-500 px-3 py-1.5 text-sm hover:bg-red-50 transition-colors"
              >
                {formatNumber(getRate(entry, "send"))}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
