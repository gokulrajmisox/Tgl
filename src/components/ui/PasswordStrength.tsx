"use client";

import { motion } from "framer-motion";

function scorePassword(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (pw.length >= 12) s += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1;
  if (/\d/.test(pw)) s += 1;
  if (/[^a-zA-Z0-9]/.test(pw)) s += 1;
  return Math.min(s, 4);
}

const LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const COLORS = ["bg-line", "bg-red-500", "bg-amber-500", "bg-emerald-600", "bg-emerald"];

/** Password strength indicator with animated segments. */
export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = scorePassword(password);
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
            <motion.div
              className={`h-full rounded-full ${i <= score ? COLORS[score] : "bg-transparent"}`}
              initial={false}
              animate={{ scaleX: i <= score ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ originX: 0 }}
            />
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-[13px] text-charcoal-500">
        Password strength:{" "}
        <span className="font-medium text-charcoal">{LABELS[score] || "Too short"}</span>
      </p>
    </div>
  );
}
