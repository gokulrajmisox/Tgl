"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/brand";
import { EASE } from "@/components/motion/motion";

const LINKS = [
  { href: "#courses", label: "Courses" },
  { href: "#internships", label: "Internships" },
  { href: "#mentors", label: "Mentors" },
];

/** Navbar: fades in on load, compacts with blur + border on scroll. */
export function SiteNav({ ctaHref = "/signup" }: { ctaHref?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-250 ${
        scrolled
          ? "border-b border-line bg-paper/85 shadow-soft backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-all duration-250 sm:px-8 ${
          scrolled ? "h-14" : "h-[72px]"
        }`}
      >
        <Link href="/" aria-label="Touch Grass Later home">
          <Logo />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative text-[15px] text-charcoal-500 transition-all duration-150 hover:-translate-y-px hover:text-charcoal"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-emerald transition-all duration-200 group-hover:w-full" aria-hidden />
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-[15px] font-medium text-charcoal-500 transition-colors hover:text-charcoal sm:block"
          >
            Sign in
          </Link>
          <Link
            href={ctaHref}
            className="inline-flex h-10 items-center rounded-xl bg-forest px-5 text-[15px] font-medium text-white shadow-soft transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
          >
            Get started
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <Logo compact />
        <p className="text-sm text-charcoal-400">Learn. Build. Grow.</p>
      </div>
    </footer>
  );
}
