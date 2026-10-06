import type { ReactNode } from "react";

/** Subtle shimmer placeholder. Never blank pages while loading. */
export function Skeleton({
  className = "",
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div role="status" aria-label={label} className={`skeleton ${className}`} />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-line bg-white px-6 py-12 text-center shadow-soft">
      {icon && <div className="mb-4 text-charcoal-400">{icon}</div>}
      <h3 className="text-base font-semibold text-charcoal">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-charcoal-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
