/* eslint-disable react/set-state-in-effect */
import { Check, ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactCountryFlag from "react-country-flag";
import { createPortal } from "react-dom";
import { useCountries } from "../../hooks/useCountries";

export type PhoneCountry = {
  name: string;
  alpha2Code: string;
  dialCode: string;
  flag: string;
};

type FormPhoneInputProps = {
  label?: string;
  countryCode: string;
  onCountryChange: (alpha2Code: string) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  defaultCountry?: string;
};

type MenuPosition = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  origin: "top" | "bottom";
};

const VIEWPORT_PADDING = 12;

function alpha2ToFlagEmoji(alpha2Code: string) {
  return alpha2Code
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function toPhoneCountries(raw: Array<{ name: string; alpha2Code: string; callingCodes?: string[] }>): PhoneCountry[] {
  return raw
    .filter(c => c.callingCodes && c.callingCodes.length > 0 && c.callingCodes[0])
    .map(c => ({
      name: c.name,
      alpha2Code: c.alpha2Code,
      dialCode: `+${c.callingCodes![0].replace("+", "")}`,
      flag: alpha2ToFlagEmoji(c.alpha2Code),
    }));
}

export default function FormPhoneInput({
  label = "Phone Number",
  countryCode,
  onCountryChange,
  value,
  onChange,
  placeholder = "801 234 5678",
  error,
  disabled = false,
  className = "",
  defaultCountry = "NG",
}: FormPhoneInputProps) {
  const { countries: rawCountries, isLoading: loadingCountries, error: countriesError } = useCountries();
  // console.log(rawCountries)

  const countries = useMemo(() => toPhoneCountries(rawCountries ?? []), [rawCountries]);

  useEffect(() => {
    if (!countryCode && countries.length > 0) {
      const fallback = countries.find(c => c.alpha2Code === defaultCountry) ?? countries[0];
      onCountryChange(fallback.alpha2Code);
    }
  }, [countryCode, countries, defaultCountry, onCountryChange]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);

  const inputId = useId();
  const listboxId = `${inputId}-listbox`;

  const selected = countries.find(c => c.alpha2Code === countryCode) ?? null;
  const resolvedError = error ?? countriesError ?? undefined;

  const filtered = query.trim()
    ? countries.filter((c) => {
        const q = query.trim().toLowerCase();
        return (
          c.name.toLowerCase().includes(q)
          || c.dialCode.replace("+", "").includes(q.replace("+", ""))
        );
      })
    : countries;

  const computePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger)
      return;

    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const estimatedMenuHeight = Math.min(
      320,
      Math.max(160, filtered.length * 44 + 56 + 16),
    );

    const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_PADDING;
    const spaceAbove = rect.top - VIEWPORT_PADDING;

    const openUpward = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

    const maxHeight = Math.max(
      160,
      Math.min(estimatedMenuHeight, openUpward ? spaceAbove : spaceBelow),
    );

    const width = Math.max(260, rect.width * 3);
    let left = rect.left;
    if (left + width > viewportWidth - VIEWPORT_PADDING) {
      left = viewportWidth - VIEWPORT_PADDING - width;
    }
    if (left < VIEWPORT_PADDING) {
      left = VIEWPORT_PADDING;
    }

    setPosition(
      openUpward
        ? { bottom: viewportHeight - rect.top + 8, left, width, maxHeight, origin: "bottom" }
        : { top: rect.bottom + 8, left, width, maxHeight, origin: "top" },
    );
  }, [filtered.length]);

  useLayoutEffect(() => {
    if (!open)
      return;
    computePosition();
  }, [open, computePosition]);

  useEffect(() => {
    if (!open)
      return;

    const handleReposition = () => computePosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, computePosition]);

  useEffect(() => {
    if (!open)
      return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target))
        return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(Math.max(0, countries.findIndex(c => c.alpha2Code === countryCode)));
      const t = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open, countries, countryCode]);

  const commit = (option: PhoneCountry) => {
    onCountryChange(option.alpha2Code);
    setOpen(false);
    numberRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const option = filtered[activeIndex];
      if (option)
        commit(option);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    onChange(digitsOnly);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-[15px] font-rh-m mb-2">
          {label}
        </label>
      )}

      <div
        className={`flex items-stretch bg-sfx-card rounded-lg border transition-colors
                   ${resolvedError ? "border-sfx-danger" : open ? "border-sfx-primary" : "border-sfx-muted/40 focus-within:border-sfx-primary"}
                   ${disabled ? "opacity-50" : ""}`}
      >
        <button
          id={inputId}
          ref={triggerRef}
          type="button"
          disabled={disabled || loadingCountries || countries.length === 0}
          onClick={() => setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          className="flex shrink-0 items-center gap-1.5 pl-4 pr-2 py-3 rounded-l-lg
                     outline-none border-r border-sfx-muted/40
                     disabled:cursor-not-allowed"
        >
          {selected
            ? (
                <>
                  <ReactCountryFlag
                    countryCode={selected.alpha2Code}
                    svg
                    style={{ width: "1.5rem", height: "1.5rem" }}
                    aria-label={label}
                  />
                  <span className="text-sfx-ink">{selected.dialCode}</span>
                </>
              )
            : (
                <span className="text-sfx-muted text-sm">
                  {loadingCountries ? "..." : "Code"}
                </span>
              )}
          <ChevronDown
            size={16}
            className={`shrink-0 text-sfx-primary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <input
          ref={numberRef}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          aria-invalid={!!resolvedError}
          aria-describedby={resolvedError ? `${inputId}-error` : undefined}
          disabled={disabled}
          value={value}
          onChange={handleNumberChange}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent px-4 py-3 outline-none
                     placeholder-sfx-muted disabled:cursor-not-allowed"
        />
      </div>

      {resolvedError && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-sfx-danger">
          {resolvedError}
        </p>
      )}

      {open && position && createPortal(
        <div
          ref={menuRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          style={{
            position: "fixed",
            top: position.top,
            bottom: position.bottom,
            left: position.left,
            width: position.width,
            maxHeight: position.maxHeight,
            zIndex: 50,
          }}
          className="flex flex-col bg-white rounded-2xl border border-black/5
                     shadow-xl p-2 overflow-hidden"
        >
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search country or code..."
            className="mb-2 shrink-0 rounded-xl bg-sfx-primary-tint px-3 py-2
                       text-sm outline-none border-2 border-transparent
                       focus:border-sfx-primary"
          />

          <ul className="overflow-y-auto flex flex-col gap-0.5">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-sfx-muted">No results found</li>
            )}

            {filtered.map((option, index) => {
              const isSelected = option.alpha2Code === countryCode;
              const isActive = index === activeIndex;
              return (
                <li
                  key={option.alpha2Code}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(option)}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5
                             rounded-xl text-sm cursor-pointer transition-colors
                             ${isActive ? "bg-sfx-primary-tint" : ""}`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <ReactCountryFlag
                      countryCode={option.alpha2Code}
                      svg
                      style={{ width: "1.5rem", height: "1.5rem" }}
                      aria-label={label}
                    />
                    <span className="truncate text-sfx-ink">{option.name}</span>
                    <span className="text-xs font-semibold text-sfx-muted">
                      {option.dialCode}
                    </span>
                  </span>
                  {isSelected && <Check size={16} className="shrink-0 text-sfx-primary" />}
                </li>
              );
            })}
          </ul>
        </div>,
        document.body,
      )}
    </div>
  );
}
