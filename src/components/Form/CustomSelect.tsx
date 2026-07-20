/* eslint-disable react/set-state-in-effect */
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { popoverContainerVariants, popoverItemVariants } from "@/lib/animations/popover-variants";

export type SelectOption = {
  label: string;
  value: string;
  tag?: string;
};

type CustomSelectProps = {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
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

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  disabled = false,
  searchable = true,
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const inputId = useId();
  const listboxId = `${inputId}-listbox`;

  const selected = options.find(o => o.value === value) ?? null;

  const filtered = query.trim()
    ? options.filter(o => o.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  const computePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger)
      return;

    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const estimatedMenuHeight = Math.min(
      320,
      Math.max(160, filtered.length * 44 + (searchable ? 56 : 0) + 16),
    );

    const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_PADDING;
    const spaceAbove = rect.top - VIEWPORT_PADDING;

    const openUpward = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

    const maxHeight = Math.max(
      160,
      Math.min(estimatedMenuHeight, openUpward ? spaceAbove : spaceBelow),
    );

    let left = rect.left;
    const width = rect.width;
    if (left + width > viewportWidth - VIEWPORT_PADDING) {
      left = viewportWidth - VIEWPORT_PADDING - width;
    }
    if (left < VIEWPORT_PADDING) {
      left = VIEWPORT_PADDING;
    }

    setPosition(
      openUpward
        ? {
            bottom: viewportHeight - rect.top + 8,
            left,
            width,
            maxHeight,
            origin: "bottom",
          }
        : {
            top: rect.bottom + 8,
            left,
            width,
            maxHeight,
            origin: "top",
          },
    );
  }, [filtered.length, searchable]);

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
      if (
        triggerRef.current?.contains(target)
        || menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(Math.max(0, options.findIndex(o => o.value === value)));
      const t = setTimeout(() => {
        (searchable ? searchRef.current : menuRef.current)?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [open, options, value, searchable]);

  const commit = (option: SelectOption) => {
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
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

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-500 mb-2"
        >
          {label}
        </label>
      )}

      <button
        id={inputId}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={`w-full flex items-center justify-between gap-2
                   bg-sfx-card rounded-2xl px-4 py-3.5
                   outline-none border-2 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed
                   ${error ? "border-sfx-danger" : open ? "border-sfx-primary" : "border-sfx-muted/40"}`}
      >
        <span
          className={`truncate text-left ${selected ? "text-sfx-ink" : "text-sfx-muted"}`}
        >
          {selected
            ? (
                <>
                  {selected.tag && (
                    <span className="text-xs font-semibold text-sfx-muted mr-2">
                      {selected.tag}
                    </span>
                  )}
                  {selected.label}
                </>
              )
            : (
                placeholder
              )}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-sfx-primary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {error && <p className="mt-1.5 text-sm text-sfx-danger">{error}</p>}

      {createPortal(
        <AnimatePresence>
          {open && position && (
            <motion.div
              ref={menuRef}
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              onKeyDown={handleKeyDown}
              variants={popoverContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: "fixed",
                top: position.top,
                bottom: position.bottom,
                left: position.left,
                width: position.width,
                maxHeight: position.maxHeight,
                transformOrigin: position.origin === "top" ? "top center" : "bottom center",
                zIndex: 50,
              }}
              className="flex flex-col bg-white rounded-2xl border border-black/5
                         shadow-xl p-2 overflow-hidden"
            >
              {searchable && (
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="mb-2 shrink-0 rounded-xl bg-sfx-primary-tint px-3 py-2
                             text-sm outline-none border-2 border-transparent
                             focus:border-sfx-primary"
                />
              )}

              <ul className="overflow-y-auto flex flex-col gap-0.5">
                {filtered.length === 0 && (
                  <li className="px-3 py-2 text-sm text-sfx-muted">
                    No results found
                  </li>
                )}

                {filtered.map((option, index) => {
                  const isSelected = option.value === value;
                  const isActive = index === activeIndex;
                  return (
                    <motion.li
                      key={option.value}
                      variants={popoverItemVariants}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => commit(option)}
                      className={`flex items-center justify-between gap-2 px-3 py-2.5
                                 rounded-xl text-sm cursor-pointer transition-colors
                                 ${isActive ? "bg-sfx-primary-tint" : ""}`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        {option.tag && (
                          <span className="text-xs font-semibold text-sfx-muted">
                            {option.tag}
                          </span>
                        )}
                        <span className="truncate text-sfx-ink">{option.label}</span>
                      </span>
                      {isSelected && (
                        <Check size={16} className="shrink-0 text-sfx-primary" />
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
