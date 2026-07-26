import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CustomSelectProps<T> = {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getKey: (option: T) => string;
  renderValue: (option: T) => ReactNode;
  renderOption: (option: T, selected: boolean) => ReactNode;
  placeholder?: string;
  triggerClassName?: string;
  panelClassName?: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 28,
      mass: 0.6,
      staggerChildren: 0.035,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: -4,
    transition: { duration: 0.14, ease: "easeIn" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 500, damping: 32 },
  },
};

export default function CustomSelect<T>({
  options,
  value,
  onChange,
  getKey,
  renderValue,
  renderOption,
  placeholder = "Select an option",
  triggerClassName = "",
  panelClassName = "",
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`w-full flex items-center justify-between p-(--spacing-card-pad) bg-sfx-card rounded-card outline-none ${triggerClassName}`}
      >
        <span className="flex items-center gap-3 min-w-0">
          {value ? renderValue(value) : <span className="text-sfx-muted">{placeholder}</span>}
        </span>
        <motion.svg
          className="size-4 text-sfx-muted shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: "top" }}
            className={`absolute z-20 top-[calc(100%+.5rem)] left-0 w-full bg-sfx-card rounded-card shadow-lg overflow-hidden px-2 py-2 ${panelClassName}`}
          >
            {options.map((option) => {
              const selected = getKey(option) === getKey(value);
              return (
                <motion.button
                  key={getKey(option)}
                  variants={itemVariants}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-[.5rem] gap-3 py-3 px-4 text-left transition-colors ${
                    selected ? "bg-sfx-primary-tint" : "hover:bg-sfx-primary-tint/60"
                  }`}
                >
                  {renderOption(option, selected)}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
