"use client";

import { motion } from "framer-motion";

/** Google sign-in button. Render only when OAuth is configured. */
export function GoogleButton({
  onClick,
  loading = false,
  label = "Continue with Google",
}: {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={loading}
      whileHover={loading ? undefined : { scale: 1.02 }}
      whileTap={loading ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      aria-busy={loading || undefined}
      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white text-[15px] font-medium text-charcoal shadow-soft transition-colors duration-150 hover:border-charcoal-400 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
          <path d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
          <path fill="#4285F4" d="M17.6 9.2c0-.7-.1-1.4-.2-2H9v3.4h4.8c-.2 1.1-.9 2-1.9 2.6v2.2h3.1c1.8-1.7 2.6-4 2.6-6.2Z" />
          <path fill="#34A853" d="M9 18c2.6 0 4.8-.9 6.4-2.3l-3.1-2.2c-.9.6-2 1-3.3 1-2.5 0-4.7-1.7-5.5-4H.3v2.3C1.9 15.7 5.2 18 9 18Z" />
          <path fill="#FBBC05" d="M3.5 10.5c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V4.4H.3C-.1 5.9-.1 12.1.3 13.6l3.2-3.1Z" />
          <path fill="#EA4335" d="M9 3.6c1.4 0 2.7.5 3.7 1.5L15.4.4C13.8-.9 11.6-.4 9-.4 5.2-.4 1.9 1.9.3 4.8l3.2 2.4c.8-2.3 3-3.6 5.5-3.6Z" />
        </svg>
      )}
      {label}
    </motion.button>
  );
}
