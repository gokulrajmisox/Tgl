/** TGL wordmark — sprout mark in forest green + name. */
export function Logo({
  compact = false,
  light = false,
}: {
  compact?: boolean;
  light?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect width="32" height="32" rx="9" fill="#073B32" />
        <path
          d="M16 24c0-5 0-8 0-11m0 0c0-3 2.5-5.5 6-5.5 0 3.5-2.5 6-6 5.5Zm0 0c0-3-2.5-5.5-6-5.5 0 3.5 2.5 6 6 5.5Z"
          stroke="#20C982"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 24h6"
          stroke="#FDFCF9"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span
          className={`text-[17px] font-semibold tracking-tight ${
            light ? "text-white" : "text-charcoal"
          }`}
        >
          Touch Grass Later
        </span>
      )}
    </span>
  );
}

/** Thin divider with centered label, e.g. "or continue with". */
export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3" aria-hidden={false}>
      <span className="h-px flex-1 bg-line" aria-hidden />
      <span className="text-[13px] text-charcoal-400">{label}</span>
      <span className="h-px flex-1 bg-line" aria-hidden />
    </div>
  );
}

/** Simple surface card with soft shadow + thin border. */
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}
