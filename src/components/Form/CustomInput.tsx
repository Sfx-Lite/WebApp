import type { ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

export type FormInputProps = {
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
};

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  name,
  autoComplete,
  required = false,
  disabled = false,
  error,
  className = "",
}: FormInputProps) {
  const [revealed, setRevealed] = useState<boolean>(false);
  const inputId = useId();
  const isPassword = type === "password";
  const resolvedType = isPassword ? (revealed ? "text" : "password") : type;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-500 mb-2"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={resolvedType}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full bg-sfx-card rounded-2xl px-4 py-3.5
                     placeholder-sfx-muted outline-none border-2 transition-colors
                     pr-11 disabled:opacity-50 disabled:cursor-not-allowed
                     ${error ? "border-sfx-danger" : "border-sfx-muted/40 focus:border-sfx-primary"}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed(r => !r)}
            disabled={disabled}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            className="absolute right-3 top-1/2 -translate-y-1/2
                       text-sfx-primary hover:text-sfx-primary/80 transition-colors
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-sfx-primary/80
                       rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {revealed ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-sfx-danger">
          {error}
        </p>
      )}
    </div>
  );
}
