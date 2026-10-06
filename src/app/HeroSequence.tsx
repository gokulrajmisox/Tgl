"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE } from "@/components/motion/motion";
import { Logo } from "@/components/ui/brand";

/**
 * Landing hero entrance sequence:
 * 0ms logo → 150ms headline → 300ms subtitle → 450ms primary CTA →
 * 600ms secondary CTA → 750ms hero visual (gentle float only).
 */
export function HeroSequence() {
  const step = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: EASE },
  });

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <motion.div {...step(0)}>
          <Logo />
        </motion.div>
        <motion.h1
          {...step(0.15)}
          className="mt-6 text-5xl font-semibold leading-[1.08] tracking-tight text-charcoal sm:text-6xl"
        >
          Learn. Build. <span className="text-forest">Grow.</span>
        </motion.h1>
        <motion.p {...step(0.3)} className="mt-5 max-w-md text-lg leading-relaxed text-charcoal-500">
          Free courses, real projects with mentor feedback, and internships
          that launch careers.
        </motion.p>
        <motion.div {...step(0.45)} className="mt-8">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center rounded-xl bg-forest px-7 text-base font-medium text-white shadow-soft transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
          >
            Start learning free
          </Link>
        </motion.div>
        <motion.div {...step(0.6)}>
          <Link
            href="/login"
            className="mt-4 inline-block text-[15px] font-medium text-forest hover:text-forest-700"
          >
            Already have an account? Sign in →
          </Link>
        </motion.div>
      </div>

      {/* Hero visual — slow float, tiny parallax, nothing constant-heavy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
        className="relative hidden lg:block"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-3xl border border-line bg-white p-6 shadow-lift"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-charcoal-400">This week</p>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-medium text-forest">
              3 projects in progress
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: "Portfolio Website", pct: 72 },
              { label: "REST API with Auth", pct: 45 },
              { label: "Data Dashboard", pct: 28 },
            ].map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.15, duration: 0.4, ease: EASE }}
                className="rounded-xl bg-mist p-3.5"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-charcoal">{p.label}</span>
                  <span className="text-charcoal-500">{p.pct}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                  <motion.div
                    className="h-full rounded-full bg-emerald"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.pct}%` }}
                    transition={{ delay: 1.2 + i * 0.15, duration: 0.8, ease: EASE }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-6 -left-8 rounded-2xl border border-line bg-white px-5 py-4 shadow-lift"
        >
          <p className="text-[13px] text-charcoal-400">Certificate earned</p>
          <p className="text-[15px] font-semibold text-charcoal">Frontend Foundations ✓</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
