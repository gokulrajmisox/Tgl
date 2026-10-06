"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOutAction } from "@/lib/auth/actions";
import { Logo } from "@/components/ui/brand";
import { EASE } from "@/components/motion/motion";
import type { Role } from "@/lib/auth/roles";

const NAV: Record<Role, { href: string; label: string }[]> = {
  student: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/courses", label: "Courses" },
    { href: "/dashboard/projects", label: "Projects" },
    { href: "/dashboard/internships", label: "Internships" },
    { href: "/dashboard/certificates", label: "Certificates" },
    { href: "/dashboard/wallet", label: "Wallet" },
  ],
  mentor: [
    { href: "/mentor/dashboard", label: "Dashboard" },
    { href: "/mentor/reviews", label: "Reviews" },
    { href: "/mentor/students", label: "Students" },
  ],
  admin: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/certificates", label: "Certificates" },
  ],
};

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const r = await signOutAction();
        router.push(r.redirectTo ?? "/login");
        router.refresh();
      }}
      className={`inline-flex items-center gap-2 rounded-xl text-sm font-medium text-charcoal-500 transition-colors hover:text-charcoal disabled:opacity-60 ${
        compact ? "px-2 py-1.5" : "px-3 py-2 hover:bg-mist"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M6 3H3v10h3M11 11l3-3-3-3M14 8H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}

function NavLinks({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Dashboard" className="space-y-1">
      {NAV[role].map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`relative flex items-center rounded-xl px-3.5 py-2.5 text-[15px] transition-colors duration-150 ${
              active ? "font-medium text-forest" : "text-charcoal-500 hover:bg-mist hover:text-charcoal"
            }`}
          >
            {active && (
              <motion.span
                layoutId="dash-nav-indicator"
                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-emerald"
                transition={{ duration: 0.25, ease: EASE }}
              />
            )}
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** App shell: sidebar on desktop, slide-in drawer on mobile. */
export function DashboardShell({
  role,
  name,
  children,
}: {
  role: Role;
  name: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const initial = name.charAt(0).toUpperCase() || "S";

  return (
    <div className="flex min-h-dvh bg-paper">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white px-4 py-6 lg:flex">
        <div className="px-2"><Logo /></div>
        <div className="mt-8 flex-1"><NavLinks role={role} /></div>
        <div className="rounded-xl bg-mist p-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white" aria-hidden>
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-charcoal">{name}</p>
              <p className="text-[12px] capitalize text-charcoal-400">{role}</p>
            </div>
          </div>
          <div className="mt-2"><SignOutButton /></div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-charcoal/40 lg:hidden"
              onClick={() => setOpen(false)} aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: EASE }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white px-4 py-6 lg:hidden"
            >
              <div className="flex items-center justify-between px-2">
                <Logo />
                <button type="button" onClick={() => setOpen(false)} aria-label="Close menu"
                  className="rounded-lg p-2 text-charcoal-500 hover:bg-mist">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="mt-8 flex-1"><NavLinks role={role} onNavigate={() => setOpen(false)} /></div>
              <SignOutButton />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-line bg-white/80 px-5 backdrop-blur-sm sm:px-8">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu"
            className="rounded-lg p-2 text-charcoal-500 hover:bg-mist lg:hidden">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-sm font-medium capitalize text-charcoal-500 lg:hidden">{role} dashboard</span>
          <div className="hidden lg:block" />
          <SignOutButton compact />
        </header>
        <main className="flex-1 px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
