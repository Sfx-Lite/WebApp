/* eslint-disable react/no-forward-ref */
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useId, useState } from "react";

export type FormInputProps = {
  label: string;
  type?: "text" | "email" | "password";
  error?: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className">;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>((
  {
    label,
    type = "text",
    error,
    className = "",
    ...rest
  },
  ref,
) => {
  const [revealed, setRevealed] = useState<boolean>(false);
  const inputId = useId();
  const isPassword = type === "password";
  const resolvedType = isPassword ? (revealed ? "text" : "password") : type;

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={inputId}
        className="block text-[15px] font-rh-m mb-2"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          type={resolvedType}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full bg-sfx-card rounded-lg px-4 py-3
                     placeholder-sfx-muted outline-none border transition-colors
                     pr-11 disabled:opacity-50 disabled:cursor-not-allowed
                     ${error ? "border-sfx-danger" : "border-sfx-muted/40 focus:border-sfx-primary"}`}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed(r => !r)}
            disabled={rest.disabled}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            className="absolute right-3 top-1/2 -translate-y-1/2
                       hover:text-sfx-muted/80 transition-colors
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
});

export default FormInput;
