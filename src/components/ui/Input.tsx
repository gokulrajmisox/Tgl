"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  /** Re-triggers the single shake when the error identity changes. */
  shakeKey?: string | number;
};

/**
 * Accessible labeled input. Invalid state: red ring + ONE subtle shake,
 * error announced via aria-describedby.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, shakeKey, id, className = "", ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    return (
      <div>
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-charcoal"
        >
          {label}
        </label>
        <input
          key={shakeKey}
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={[error ? errorId : null, hint ? hintId : null]
            .filter(Boolean)
            .join(" ") || undefined}
          className={`h-11 w-full rounded-xl border bg-white px-3.5 text-[15px] text-charcoal placeholder:text-charcoal-400 transition-[border-color,box-shadow] duration-150 focus:outline-none ${
            error
              ? "border-red-500 animate-shake-once focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
              : "border-line hover:border-charcoal-400 focus:border-emerald focus:shadow-glow"
          } ${className}`}
          {...rest}
        />
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-[13px] text-charcoal-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-[13px] text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/** Password input with show/hide toggle (smooth icon morph). */
export function PasswordInput({
  label,
  ...rest
}: Omit<InputProps, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        label={label}
        type={visible ? "text" : "password"}
        autoComplete={rest.autoComplete ?? "current-password"}
        className="pr-11"
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2.5 top-[34px] rounded-md p-1.5 text-charcoal-400 transition-colors hover:text-charcoal"
      >
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          animate={{ scale: 1, rotate: 0 }}
          key={String(visible)}
          initial={{ scale: 0.85, opacity: 0.4 }}
          transition={{ duration: 0.15 }}
        >
          {visible ? (
            <path
              d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10Z M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          ) : (
            <path
              d="M3 3l14 14M9.9 4.6A7.8 7.8 0 0 1 18 10a8.6 8.6 0 0 1-2.2 3.1M6 6.5A8.2 8.2 0 0 0 2 10s3 5.5 8 5.5c1.5 0 2.9-.4 4-1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )}
        </motion.svg>
      </button>
    </div>
  );
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
};

/** Checkbox with animated check draw. */
export function Checkbox({ label, id, className = "", ...rest }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label
      htmlFor={inputId}
      className={`inline-flex cursor-pointer items-center gap-2.5 text-sm text-charcoal ${className}`}
    >
      <span className="relative inline-flex h-5 w-5 shrink-0">
        <input
          id={inputId}
          type="checkbox"
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-line bg-white transition-colors checked:border-forest checked:bg-forest focus-visible:outline-2"
          {...rest}
        />
        <svg
          viewBox="0 0 12 12"
          aria-hidden
          className="pointer-events-none absolute inset-0 m-auto h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
        >
          <motion.path
            d="M2.5 6.2 5 8.5 9.7 3.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
          />
        </svg>
      </span>
      <span>{label}</span>
    </label>
  );
}
