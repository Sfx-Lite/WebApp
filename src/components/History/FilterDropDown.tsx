import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  variant?: "filled" | "outline";
};

export default function FilterDropdown<T extends string>({ label, value, options, onChange, variant = "outline" }: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen)
      return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedLabel = options.find(o => o.value === value)?.label ?? label;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full font-rh-sb text-[14px] ${
          variant === "filled"
            ? "bg-sfx-primary text-white"
            : "bg-white border border-sfx-primary text-sfx-primary"
        }`}
      >
        {selectedLabel}
        <ChevronDown className="size-3.5" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-20 min-w-[160px] bg-white rounded-2xl shadow-xl border border-sfx-muted/15 py-1.5 overflow-hidden">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-[14px] font-rh-m ${
                option.value === value ? "text-sfx-primary bg-sfx-primary-tint" : "text-sfx-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
