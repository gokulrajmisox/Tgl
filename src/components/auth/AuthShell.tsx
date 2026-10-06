"use client";

import { motion } from "framer-motion";
import { EASE } from "@/components/motion/motion";
import { Logo } from "@/components/ui/brand";
import type { ReactNode } from "react";

const BENEFITS = [
  "Learn with free courses and certificates.",
  "Build practical projects with mentor feedback.",
  "Track your progress, rewards, and credentials.",
];

/**
 * Two-column auth layout. Left: forest brand panel. Right: the form.
 * Collapses to a single column with a condensed brand header on mobile.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-paper">
      {/* Left brand panel — desktop */}
      <aside className="relative hidden w-[44%] shrink-0 overflow-hidden bg-forest lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-emerald/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative"
        >
          <Logo light />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          className="relative"
        >
          <h1 className="max-w-md text-4xl font-semibold leading-[1.15] tracking-tight text-white xl:text-[2.75rem]">
            Your next chapter starts here.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
            Learn new skills, build real projects, and unlock internship
            opportunities.
          </p>
          <ul className="mt-8 space-y-4">
            {BENEFITS.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.08, ease: EASE }}
                className="flex items-start gap-3 text-[14px] text-white/85"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/20">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path
                      d="M2.5 6.2 5 8.5 9.7 3.6"
                      stroke="#20C982"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {b}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative text-sm font-medium tracking-wide text-white/50"
        >
          Learn. Build. Grow.
        </motion.p>
      </aside>

      {/* Right form panel */}
      <main className="flex flex-1 flex-col">
        {/* Condensed brand header — mobile / tablet */}
        <div className="flex items-center justify-between px-5 pt-5 sm:px-8 lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="w-full max-w-[400px]"
          >
            {children}
          </motion.div>
        </div>
        <p className="px-5 pb-6 text-center text-[13px] text-charcoal-400 lg:hidden">
          Learn. Build. Grow.
        </p>
      </main>
    </div>
  );
}
